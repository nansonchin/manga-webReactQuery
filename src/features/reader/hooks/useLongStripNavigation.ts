import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";


import type {
  Virtualizer,
} from "@tanstack/react-virtual";


type UseLongStripNavigationProps = {
  currentPage: number;
  totalPages: number;


  /**
   * TanStack Virtualizer。
   *
   * 真正负责 Long Strip scroll。
   */
  virtualizer: Virtualizer<
    HTMLElement,
    Element
  >;


  /**
   * 程序导航成功以后，
   * 更新 Reader 的 currentPage。
   */
  onPageChange: (
    page: number
  ) => void;


  /**
   * 告诉 tracking：
   *
   * true  = 程序正在导航
   * false = 用户可以重新控制 currentPage
   */
  setProgrammaticNavigation?: (
    value: boolean
  ) => void;
};


export function useLongStripNavigation({
  currentPage,
  totalPages,
  virtualizer,
  onPageChange,
  setProgrammaticNavigation,
}: UseLongStripNavigationProps) {
  /**
   * ---------------------------------------------------------
   * targetPage
   * ---------------------------------------------------------
   *
   * 只是方便外部 debug / restore。
   *
   * 真正 scroll 不再依赖这个 state。
   */
  const [
    targetPage,
    setTargetPage,
  ] = useState<number | null>(
    null
  );


  /**
   * ---------------------------------------------------------
   * current page ref
   * ---------------------------------------------------------
   *
   * 非常重要。
   *
   * React state update 是 asynchronous。
   *
   * 如果用户连续快速点击：
   *
   * currentPage = 5
   *
   * click next
   * click next
   *
   * 第二次 click 可能还拿到旧的 currentPage = 5。
   *
   * 所以这里另外保存最新 page。
   */
  const currentPageRef =
    useRef(currentPage);


  /**
   * React currentPage 改变时，
   * 同步 ref。
   */
  useEffect(() => {
    currentPageRef.current =
      currentPage;
  }, [currentPage]);


  /**
   * ---------------------------------------------------------
   * Unlock timer
   * ---------------------------------------------------------
   *
   * 程序 scroll 完以后，
   * 延迟一点再允许 tracking 控制 currentPage。
   */
  const unlockTimerRef =
    useRef<number | null>(null);


  /**
   * ---------------------------------------------------------
   * clamp
   * ---------------------------------------------------------
   */
  const clampPage = useCallback(
    (page: number) => {
      if (totalPages <= 0) {
        return 0;
      }


      return Math.min(
        Math.max(
          page,
          0
        ),
        totalPages - 1
      );
    },
    [totalPages]
  );


  /**
   * ---------------------------------------------------------
   * 清除 unlock timer
   * ---------------------------------------------------------
   */
  const clearUnlockTimer =
    useCallback(() => {
      if (
        unlockTimerRef.current !==
        null
      ) {
        window.clearTimeout(
          unlockTimerRef.current
        );


        unlockTimerRef.current =
          null;
      }
    }, []);


  /**
   * ---------------------------------------------------------
   * 开始程序导航
   * ---------------------------------------------------------
   */
  const startProgrammaticNavigation =
    useCallback(() => {
      clearUnlockTimer();


      /**
       * 暂时禁止 tracking 改 currentPage。
       */
      setProgrammaticNavigation?.(
        true
      );


      /**
       * 最后一次 scroll event
       * 发生以后约 150ms 再解除 lock。
       *
       * 为什么不是马上 false？
       *
       * 因为：
       *
       * scrollToIndex()
       *
       * 会改变 scrollTop。
       *
       * scrollTop 改变会触发 tracking。
       */
      const unlock =
        () => {
          unlockTimerRef.current =
            null;


          setProgrammaticNavigation?.(
            false
          );
        };


      unlockTimerRef.current =
        window.setTimeout(
          unlock,
          180
        );
    }, [
      clearUnlockTimer,
      setProgrammaticNavigation,
    ]);


  /**
   * ---------------------------------------------------------
   * requestScrollToPage
   * ---------------------------------------------------------
   *
   * 这是整个 Long Strip 的核心。
   *
   * 以前：
   *
   * querySelector()
   * +
   * scrollIntoView()
   *
   * 现在：
   *
   * virtualizer.scrollToIndex()
   */
  const requestScrollToPage =
    useCallback(
      (page: number) => {
        if (
          totalPages <= 0
        ) {
          return;
        }


        const safePage =
          clampPage(page);


        /**
         * 已经是当前页，
         * 不需要重复 scroll。
         */
        if (
          safePage ===
          currentPageRef.current
        ) {
          return;
        }


        /**
         * 保存最新目标。
         */
        currentPageRef.current =
          safePage;


        setTargetPage(
          safePage
        );


        /**
         * 告诉 tracking：
         *
         * 接下来这个 scroll 是程序产生的。
         */
        startProgrammaticNavigation();


        /**
         * ---------------------------------------------------
         * 关键：
         *
         * 不再：
         *
         * document.querySelector()
         *
         * 不再：
         *
         * element.scrollIntoView()
         *
         * 而是直接使用 TanStack Virtualizer。
         *
         * 即使 target page 当前还没有 render，
         * Virtualizer 也可以根据 index 找到它。
         * ---------------------------------------------------
         */
        virtualizer.scrollToIndex(
          safePage,
          {
            align: "start",
            behavior: "auto",
          }
        );


        /**
         * 程序导航自己更新 currentPage。
         *
         * 不等待 IntersectionObserver。
         */
        onPageChange(
          safePage
        );


        /**
         * request 已经处理。
         */
        setTargetPage(null);
      },
      [
        clampPage,
        onPageChange,
        startProgrammaticNavigation,
        totalPages,
        virtualizer,
      ]
    );


  /**
   * ---------------------------------------------------------
   * Next page
   * ---------------------------------------------------------
   */
  const scrollToNextPage =
    useCallback(() => {
      if (
        totalPages <= 0
      ) {
        return;
      }


      const page =
        currentPageRef.current;


      if (
        page >=
        totalPages - 1
      ) {
        return;
      }


      requestScrollToPage(
        page + 1
      );
    }, [
      requestScrollToPage,
      totalPages,
    ]);


  /**
   * ---------------------------------------------------------
   * Previous page
   * ---------------------------------------------------------
   */
  const scrollToPreviousPage =
    useCallback(() => {
      if (
        totalPages <= 0
      ) {
        return;
      }


      const page =
        currentPageRef.current;


      if (page <= 0) {
        return;
      }


      requestScrollToPage(
        page - 1
      );
    }, [
      requestScrollToPage,
      totalPages,
    ]);


  /**
   * ---------------------------------------------------------
   * Cleanup
   * ---------------------------------------------------------
   */
  useEffect(() => {
    return () => {
      clearUnlockTimer();


      setProgrammaticNavigation?.(
        false
      );
    };
  }, [
    clearUnlockTimer,
    setProgrammaticNavigation,
  ]);


  return {
    targetPage,
    requestScrollToPage,
    scrollToNextPage,
    scrollToPreviousPage,
  };
}





