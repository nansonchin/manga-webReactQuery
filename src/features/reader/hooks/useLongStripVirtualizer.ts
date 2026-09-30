import { useVirtualizer } from "@tanstack/react-virtual";
import { useRef } from "react";


type UseLongStripVirtualizerProps = {
  count: number;
};


export function useLongStripVirtualizer({
  count,
}: UseLongStripVirtualizerProps) {
  /**
   * ---------------------------------------------------------
   * Scroll container
   * ---------------------------------------------------------
   *
   * LongStripReader 会把真正的 <section>
   * 放进这个 ref。
   *
   * Virtualizer 会监听这个 element 的 scroll。
   */
  const parentRef =
    useRef<HTMLElement | null>(null);


  /**
   * ---------------------------------------------------------
   * TanStack Virtualizer
   * ---------------------------------------------------------
   *
   * Virtualizer 负责：
   *
   * 1. 哪些 page 要 render
   * 2. 每个 page 在整个 long strip 中的位置
   * 3. page 的实际高度
   * 4. scrollToIndex()
   */
  const virtualizer =
    useVirtualizer({
      /**
       * 总 page 数量。
       */
      count,


      /**
       * 告诉 Virtualizer：
       *
       * “我的 scroll container 是 parentRef.current”
       */
      getScrollElement: () =>
        parentRef.current,


      /**
       * 在 page 尚未测量以前，
       * 先使用这个高度估算。
       *
       * 800 比较接近一般 desktop/mobile manga page。
       */
      estimateSize: () => 800,


      /**
       * 多 render 几页。
       *
       * 例如当前看到 page 5，
       * 前后额外 render 2 页。
       */
      overscan: 2,


      /**
       * 使用实际 DOM 高度测量 page。
       *
       * TanStack 会在 page render 后
       * 根据真实高度更新 VirtualItem.size。
       */
      measureElement: (
        element
      ) => {
        return element.getBoundingClientRect()
          .height;
      },
    });


  return {
    parentRef,
    virtualizer,
  };
}





