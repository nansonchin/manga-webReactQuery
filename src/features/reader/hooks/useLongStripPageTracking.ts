import {
  useCallback,
  useEffect,
  useRef,
} from "react";


import type {
  Virtualizer,
} from "@tanstack/react-virtual";


type UseLongStripPageTrackingProps = {
  /**
   * Long Strip 是否开启。
   */
  enabled: boolean;


  /**
   * Long Strip scroll container。
   */
  root: HTMLElement | null;


  /**
   * TanStack Virtualizer。
   */
  virtualizer: Virtualizer<
    HTMLElement,
    Element
  >;


  /**
   * 当前 page 改变以后，
   * 通知 ReaderPage。
   */
  onPageChange: (
    page: number
  ) => void;
};


export function useLongStripPageTracking({
  enabled,
  root,
  virtualizer,
  onPageChange,
}: UseLongStripPageTrackingProps) {
  /**
   * ---------------------------------------------------------
   * 防止重复 requestAnimationFrame
   * ---------------------------------------------------------
   */
  const rafRef =
    useRef<number | null>(
      null
    );


  /**
   * ---------------------------------------------------------
   * 上一次 page
   * ---------------------------------------------------------
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
    useRef<number | null>(
      null
    );


  /**
   * ---------------------------------------------------------
   * Programmatic navigation lock
   * ---------------------------------------------------------
   *
   * true：
   * button / keyboard 正在主动 navigation。
   *
   * false：
   * 用户正常 scroll。
   */
  const programmaticNavigationRef =
    useRef(false);


  /**
   * ---------------------------------------------------------
   * 外部控制 programmatic navigation
   * ---------------------------------------------------------
   */
  const setProgrammaticNavigation =
    useCallback(
      (value: boolean) => {
        programmaticNavigationRef.current =
          value;
      },
      []
    );


  /**
   * ---------------------------------------------------------
   * 找 current page
   * ---------------------------------------------------------
   *
   * 不再使用 IntersectionObserver。
   *
   * 我们直接使用 VirtualItem：
   *
   * item.start
   * item.end
   *
   * 来判断 viewport center 落在哪一页。
   */
  const updateCurrentPage =
    useCallback(() => {
      if (!enabled) {
        return;
      }


      if (!root) {
        return;
      }


      /**
       * 程序 navigation 时，
       * 不允许 tracking 抢 currentPage。
       */
      if (
        programmaticNavigationRef.current
      ) {
        return;
      }


      /**
       * 当前 viewport center。
       *
       * scrollTop 是整个 Long Strip
       * 的 scroll position。
       */
      const viewportCenter =
        root.scrollTop +
        root.clientHeight / 2;


      /**
       * 当前 virtual items。
       */
      const virtualItems =
        virtualizer.getVirtualItems();


      if (
        virtualItems.length === 0
      ) {
        return;
      }


      let closestIndex =
        virtualItems[0].index;


      let closestDistance =
        Infinity;


      /**
       * 找 viewport center
       * 最近的 page。
       */
      for (
        const item of virtualItems
      ) {
        /**
         * 如果 viewport center
         * 正好落在 page 内，
         * 这个就是 current page。
         */
        if (
          viewportCenter >=
            item.start &&
          viewportCenter <
            item.end
        ) {
          closestIndex =
            item.index;


          closestDistance = 0;


          break;
        }


        /**
         * 如果 center 不在任何 page，
         * 就找距离 page center 最近的。
         */
        const itemCenter =
          item.start +
          item.size / 2;


        const distance =
          Math.abs(
            itemCenter -
              viewportCenter
          );


        if (
          distance <
          closestDistance
        ) {
          closestDistance =
            distance;


          closestIndex =
            item.index;
        }
      }


      /**
       * page 没变化。
       */
      if (
        lastPageRef.current ===
        closestIndex
      ) {
        return;
      }


      /**
       * 保存。
       */
      lastPageRef.current =
        closestIndex;


      /**
       * 更新 React state。
       */
      onPageChange(
        closestIndex
      );
    }, [
      enabled,
      onPageChange,
      root,
      virtualizer,
    ]);


  /**
   * ---------------------------------------------------------
   * Scroll handler
   * ---------------------------------------------------------
   *
   * 用户 scroll 的时候：
   *
   * scroll event
   *       ↓
   * requestAnimationFrame
   *       ↓
   * updateCurrentPage()
   *
   * 不在 scroll event 中直接读取大量 layout。
   */
  const handleScroll =
    useCallback(() => {
      if (
        rafRef.current !==
        null
      ) {
        return;
      }


      rafRef.current =
        window.requestAnimationFrame(
          () => {
            rafRef.current =
              null;


            updateCurrentPage();
          }
        );
    }, [
      updateCurrentPage,
    ]);


  /**
   * ---------------------------------------------------------
   * 建立 scroll listener
   * ---------------------------------------------------------
   */
  useEffect(() => {
    if (!enabled) {
      return;
    }


    if (!root) {
      return;
    }


    /**
     * 建立 listener。
     */
    root.addEventListener(
      "scroll",
      handleScroll,
      {
        passive: true,
      }
    );


    /**
     * 页面第一次 render 后，
     * 计算一次 currentPage。
     */
    const initialRaf =
      window.requestAnimationFrame(
        () => {
          updateCurrentPage();
        }
      );


    /**
     * cleanup。
     */
    return () => {
      root.removeEventListener(
        "scroll",
        handleScroll
      );


      window.cancelAnimationFrame(
        initialRaf
      );


      if (
        rafRef.current !==
        null
      ) {
        window.cancelAnimationFrame(
          rafRef.current
        );


        rafRef.current =
          null;
      }
    };
  }, [
    enabled,
    handleScroll,
    root,
    updateCurrentPage,
  ]);


  /**
   * ---------------------------------------------------------
   * Reset last page
   * ---------------------------------------------------------
   *
   * 当 root / mode 改变以后，
   * 重新允许计算。
   */
  useEffect(() => {
    lastPageRef.current =
      null;
  }, [
    enabled,
    root,
  ]);


  return {
    setProgrammaticNavigation,
  };
}
