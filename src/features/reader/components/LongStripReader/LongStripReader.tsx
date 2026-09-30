import { useEffect, useState } from "react";
import { useLongStripVirtualizer } from "../../hooks/useLongStripVirtualizer";
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
  targetPage: number | null;
  observePage: (element: HTMLElement | null) => void;
  onScrollContainerReady:(element:HTMLElement|null)=>void;
};


function LongStripReader({
  pages,
  currentPage,
  renderAhead,
  targetPage,
  observePage,
  onScrollContainerReady,
}: LongStripReaderProps) {
  const { parentRef, virtualizer } = useLongStripVirtualizer({
    count: pages.length,
  });

  const virtualItems = virtualizer.getVirtualItems();

  useEffect(()=>{
    onScrollContainerReady(parentRef.current)
  },[parentRef])

  return (
    <section
      ref={(element)=>{
        parentRef.current = element
        onScrollContainerReady(element)
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
        {virtualItems.map((virtualItem) => {
          const page = pages[virtualItem.index];


          if (!page) {
            return null;
          }


          const distanceFromCurrentPage = Math.abs(
            page.index - currentPage
          );


          const isNearCurrentPage =
            distanceFromCurrentPage <= renderAhead;


          const isTargetPage =
            targetPage !== null &&
            page.index === targetPage;


          const shouldLoad =
            isNearCurrentPage || isTargetPage;


          return (
            <div
              key={page.index}
              className="reader-long-strip__page"
              data-page={page.index + 1}
              data-index={virtualItem.index}
              ref={(element) => {
                if (!element) {
                  return;
                }


                virtualizer.measureElement(element);
                observePage(element);
              }}
              style={{
                transform: `translateY(${virtualItem.start}px)`,
              }}
            >
              <div className="reader-long-strip__page-inner">
                <ReaderImage
                  src={page.url}
                  alt={`Page ${page.index + 1}`}
                  shouldLoad={shouldLoad}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}


export default LongStripReader;



