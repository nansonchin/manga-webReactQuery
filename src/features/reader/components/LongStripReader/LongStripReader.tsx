import type {
  ReactVirtualizer,
} from "@tanstack/react-virtual";


import ReaderImage from "../ReaderImage/ReaderImage";


import "./LongStripReader.scss";


type ReaderPageData = {
  index: number;
  url: string;
};


type LongStripReaderProps = {
  pages: ReaderPageData[];


  currentPage: number;


  renderAhead: number;


  parentRef: React.RefObject<
    HTMLElement | null
  >;


  virtualizer: ReactVirtualizer<
    HTMLElement,
    Element
  >;


  onScrollContainerReady: (
    element: HTMLElement | null
  ) => void;
};


function LongStripReader({
  pages,
  currentPage,
  renderAhead,
  parentRef,
  virtualizer,
  onScrollContainerReady,
}: LongStripReaderProps) {
  const virtualItems =
    virtualizer.getVirtualItems();


  return (
    <section
      ref={(element) => {
        /**
         * 给 TanStack Virtualizer。
         */
        parentRef.current =
          element;


        /**
         * 给 tracking。
         */
        onScrollContainerReady(
          element
        );
      }}
      className="reader-long-strip"
      aria-label="Long strip reader"
    >
      <div
        className="reader-long-strip__content"
        style={{
          height: `${virtualizer.getTotalSize()}px`,
        }}
      >
        {virtualItems.map(
          (virtualItem) => {
            const page =
              pages[
                virtualItem.index
              ];


            if (!page) {
              return null;
            }


            const distanceFromCurrentPage =
              Math.abs(
                page.index -
                  currentPage
              );


            const isNearCurrentPage =
              distanceFromCurrentPage <=
              renderAhead;


            return (
              <div
                key={page.index}
                className="reader-long-strip__page"
                data-page={
                  page.index + 1
                }
                data-index={
                  virtualItem.index
                }
                ref={
                  virtualizer.measureElement
                }
                style={{
                  transform: `translateY(${virtualItem.start}px)`,
                }}
              >
                <div className="reader-long-strip__page-inner">
                  <ReaderImage
                    src={page.url}
                    alt={`Page ${
                      page.index + 1
                    }`}
                    shouldLoad={
                      isNearCurrentPage
                    }
                  />
                </div>
              </div>
            );
          }
        )}
      </div>
    </section>
  );
}


export default LongStripReader;





