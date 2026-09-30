import {
  useCallback,
  useEffect,
  useState,
} from "react";


type UseLongStripNavigationProps = {
  currentPage: number;
  totalPages: number;


  /**
   * 当程序主动跳页完成以后，
   * 通知外面的 currentPage 更新。
   */
  onPageChange: (page: number) => void;
};


export function useLongStripNavigation({
  currentPage,
  totalPages,
  onPageChange,
}: UseLongStripNavigationProps) {
  /**
   * 当前需要滚动到的目标页面。
   *
   * 注意：
   *
   * currentPage 是“现在页面”
   *
   * targetPage 是“我要去哪里”
   */
  const [targetPage, setTargetPage] =
    useState<number | null>(null);


  /**
   * 把 page 限制在合法范围。
   *
   * 例如：
   *
   * totalPages = 10
   *
   * -1  -> 0
   * 0   -> 0
   * 5   -> 5
   * 20  -> 9
   */
  const clampPage = useCallback(
    (page: number) => {
      if (totalPages <= 0) {
        return 0;
      }


      return Math.min(
        Math.max(page, 0),
        totalPages - 1
      );
    },
    [totalPages]
  );


  /**
   * 请求跳到指定页面。
   *
   * 这个 function 本身不直接 scroll。
   *
   * 它只是：
   *
   * targetPage = 某一页
   *
   * 然后 useEffect 再负责真正操作 DOM。
   */
  const requestScrollToPage =
    useCallback(
      (page: number) => {
        if (totalPages <= 0) {
          return;
        }


        const safePage =
          clampPage(page);


        setTargetPage(safePage);
      },
      [
        clampPage,
        totalPages,
      ]
    );


  /**
   * targetPage 改变以后，
   * 真正执行 scroll。
   */
  useEffect(() => {
    /**
     * 没有目标，不做任何事情。
     */
    if (targetPage === null) {
      return;
    }


    /**
     * 找到对应页面。
     *
     * data-page 是 1-based。
     *
     * targetPage 是 0-based。
     *
     * 所以：
     *
     * targetPage = 4
     *
     * data-page = 5
     */
    const element =
      document.querySelector<HTMLElement>(
        `[data-page="${
          targetPage + 1
        }"]`
      );


    /**
     * Virtualizer 目前还没有把这个 page
     * render 到 DOM。
     *
     * 这里先不要清掉 targetPage。
     *
     * 下一次 render 后 useEffect 会再次执行。
     */
    if (!element) {
      return;
    }


    /**
     * 找到目标 page。
     *
     * 直接滚动。
     */
    element.scrollIntoView({
      behavior: "auto",
      block: "start",
    });


    /**
     * 非常重要：
     *
     * 程序主动 navigation 不应该等待
     * IntersectionObserver 再决定 currentPage。
     *
     * 我们自己明确告诉 currentPage：
     *
     * “现在已经去 targetPage 了。”
     */
    onPageChange(targetPage);


    /**
     * target 已经处理完。
     */
    setTargetPage(null);
  }, [
    targetPage,
    onPageChange,
  ]);


  /**
   * 下一页。
   *
   * currentPage:
   *
   * 0 -> 1
   * 1 -> 2
   * 2 -> 3
   */
  const scrollToNextPage =
    useCallback(() => {
      if (totalPages <= 0) {
        return;
      }


      /**
       * 已经是最后一页。
       */
      if (
        currentPage >=
        totalPages - 1
      ) {
        return;
      }


      requestScrollToPage(
        currentPage + 1
      );
    }, [
      currentPage,
      totalPages,
      requestScrollToPage,
    ]);


  /**
   * 上一页。
   *
   * currentPage:
   *
   * 5 -> 4
   * 4 -> 3
   * 3 -> 2
   */
  const scrollToPreviousPage =
    useCallback(() => {
      if (totalPages <= 0) {
        return;
      }


      /**
       * 已经第一页。
       */
      if (currentPage <= 0) {
        return;
      }


      requestScrollToPage(
        currentPage - 1
      );
    }, [
      currentPage,
      totalPages,
      requestScrollToPage,
    ]);


  return {
    targetPage,


    requestScrollToPage,


    scrollToNextPage,


    scrollToPreviousPage,
  };
}

