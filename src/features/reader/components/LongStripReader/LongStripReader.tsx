import { useLongStripNavigation } from "../../hooks/useLongStripNavigation";
import { useLongStripVirtualizer } from "../../hooks/useLongStripVirtualizer";
import ReaderImage from "../ReaderImage/ReaderImage";

type ReaderPageData = {
  index: number;
  url: string;
};

type LongStripReaderProps = {
  pages: ReaderPageData[];
  currentPage: number;
  renderAhead: number;
  targetPage: number | null;
  observePage: (element: HTMLElement | null) => void;
};

function LongStripReader({
  pages,
  currentPage,
  renderAhead,
  targetPage,
  observePage,
}: LongStripReaderProps) {
  const { parentRef, virtualizer } = useLongStripVirtualizer({
    count: pages.length,
  });

  const virtualItems = virtualizer.getVirtualItems();

  // const renderFromPage = Math.max(
  //   currentPage,
  //   targetPage ?? 0,
  // )
  return (
    <div
      ref={parentRef}
      className="reader-long-strip"
      style={{ height: "100vh", overflow: "auto", position: "relative" }}
    >
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: "100%",
          position: "relative",
        }}
      ></div>
      {virtualItems.map((virtualItem) => {
        // const shouldLoad = page.index <= renderFromPage + renderAhead;
        const page = pages[virtualItem.index];
        if (!page) {
          return null;
        }

        const isNearCurrentPage =
          Math.abs(page.index - currentPage) <= renderAhead;

        const isTargetPage = targetPage !== null && page.index === targetPage;

        const shouldLoad = isNearCurrentPage || isTargetPage;

        return (
          <div
            key={page.index}
            data-page={page.index + 1}
            ref={(element) => {
              if (!element) {
                return;
              }
              virtualizer.measureElement(element);
              observePage(element);
            }}
            data-index={virtualItem.index}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              transform: `translateY(${virtualItem.start}px)`,
            }}
          >
            <ReaderImage
              src={page.url}
              alt={`Page ${page.index + 1}`}
              shouldLoad={shouldLoad}
            />
          </div>
        );
      })}
    </div>
  );
}

export default LongStripReader;
