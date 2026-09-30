import {
  useCallback,
  useEffect,
  useRef,
} from "react";


type UseLongStripPageTrackingProps = {
  /**
   * 是否启用 tracking。
   *
   * Long Strip = true
   * Single Page = false
   */
  enabled: boolean;


  /**
   * Long Strip 的 scroll container。
   */
  root: HTMLElement | null;


  /**
   * 找到当前 page 后，
   * 通知 ReaderPage。
   */
  onPageChange: (page: number) => void;
};


export function useLongStripPageTracking({
  enabled,
  root,
  onPageChange,
}: UseLongStripPageTrackingProps) {
  /**
   * 保存 IntersectionObserver。
   */
  const observerRef =
    useRef<IntersectionObserver | null>(
      null
    );


  /**
   * 当前正在 viewport 中的页面。
   *
   * Element -> page number
   *
   * 例如：
   *
   * Page DOM A -> 4
   * Page DOM B -> 5
   * Page DOM C -> 6
   */
  const visiblePagesRef =
    useRef<Map<Element, number>>(
      new Map()
    );


  /**
   * 上一次已经通知出去的 page。
   *
   * 防止：
   *
   * 5
   * 5
   * 5
   * 5
   *
   * 一直 setState。
   */
  const lastPageRef =
    useRef<number | null>(null);


  /**
   * 根据目前 viewport 中的 pages，
   * 找出距离 viewport 中心最近的 page。
   */
  const updateCurrentPage =
    useCallback(() => {
      /**
       * 没有 root。
       */
      if (!root) {
        return;
      }


      /**
       * 没有 visible page。
       */
      if (
        visiblePagesRef.current.size ===
        0
      ) {
        return;
      }


      /**
       * scroll container 的位置。
       */
      const rootRect =
        root.getBoundingClientRect();


      /**
       * viewport 中心。
       */
      const viewportCenter =
        rootRect.top +
        rootRect.height / 2;


      /**
       * 当前最近的 page。
       */
      let closestPage: number | null =
        null;


      /**
       * 最近距离。
       */
      let closestDistance =
        Infinity;


      /**
       * 遍历所有 visible pages。
       */
      visiblePagesRef.current.forEach(
        (page, element) => {
          /**
           * page 的位置。
           */
          const rect =
            element.getBoundingClientRect();


          /**
           * page 中心。
           */
          const pageCenter =
            rect.top +
            rect.height / 2;


          /**
           * page center 距离 viewport center。
           */
          const distance =
            Math.abs(
              pageCenter -
                viewportCenter
            );


          /**
           * 找最近的 page。
           */
          if (
            distance <
            closestDistance
          ) {
            closestDistance =
              distance;


            closestPage =
              page;
          }
        }
      );


      /**
       * 没找到。
       */
      if (
        closestPage === null
      ) {
        return;
      }


      /**
       * data-page 是 1-based。
       *
       * currentPage 是 0-based。
       *
       * 所以：
       *
       * data-page = 5
       *
       * currentPage = 4
       */
      const nextPage =
        closestPage - 1;


      /**
       * 没有变化。
       */
      if (
        lastPageRef.current ===
        nextPage
      ) {
        return;
      }


      /**
       * 保存。
       */
      lastPageRef.current =
        nextPage;


      /**
       * 通知外面。
       */
      onPageChange(nextPage);
    }, [
      root,
      onPageChange,
    ]);


  /**
   * 建立 IntersectionObserver。
   */
  useEffect(() => {
    /**
     * Single Page 不需要 observer。
     */
    if (!enabled) {
      return;
    }


    /**
     * 没有 scroll container。
     */
    if (!root) {
      return;
    }


    /**
     * 清理旧 observer。
     */
    observerRef.current?.disconnect();


    /**
     * 清空旧数据。
     */
    visiblePagesRef.current.clear();


    lastPageRef.current = null;


    /**
     * 创建新的 IntersectionObserver。
     */
    const observer =
      new IntersectionObserver(
        (entries) => {
          /**
           * 处理所有发生变化的 page。
           */
          entries.forEach(
            (entry) => {
              /**
               * 从 DOM 拿 page number。
               */
              const page =
                Number(
                  entry.target.getAttribute(
                    "data-page"
                  )
                );


              /**
               * 不是合法 page。
               */
              if (
                !Number.isInteger(page)
              ) {
                return;
              }


              /**
               * Page 进入 viewport。
               */
              if (
                entry.isIntersecting
              ) {
                visiblePagesRef.current.set(
                  entry.target,
                  page
                );
              } else {
                /**
                 * Page 离开 viewport。
                 */
                visiblePagesRef.current.delete(
                  entry.target
                );
              }
            }
          );


          /**
           * Observer 变化以后，
           * 重新判断 currentPage。
           */
          updateCurrentPage();
        },
        {
          /**
           * 只观察 LongStrip container。
           */
          root,


          /**
           * 页面只要进入一点点就算 visible。
           */
          threshold: 0,


          /**
           * 这里先使用 0。
           *
           * 不再用 -40%。
           */
          rootMargin: "0px",
        }
      );


    /**
     * 保存 observer。
     */
    observerRef.current =
      observer;


    /**
     * 找当前已经 render 的 pages。
     */
    const elements =
      root.querySelectorAll<HTMLElement>(
        "[data-page]"
      );


    /**
     * 注册 observer。
     */
    elements.forEach(
      (element) => {
        observer.observe(element);
      }
    );


    /**
     * cleanup。
     */
    return () => {
      observer.disconnect();


      observerRef.current =
        null;


      visiblePagesRef.current.clear();


      lastPageRef.current = null;
    };
  }, [
    enabled,
    root,
    updateCurrentPage,
  ]);


  /**
   * LongStripReader 每 render 一个 page，
   * 就会调用这个 function。
   */
  const observePage =
    useCallback(
      (
        element: HTMLElement | null
      ) => {
        /**
         * DOM 不存在。
         */
        if (!element) {
          return;
        }


        /**
         * 当前不是 LongStrip。
         */
        if (!enabled) {
          return;
        }


        /**
         * 注册这个 page。
         */
        observerRef.current?.observe(
          element
        );
      },
      [enabled]
    );


  return {
    observePage,
  };
}





