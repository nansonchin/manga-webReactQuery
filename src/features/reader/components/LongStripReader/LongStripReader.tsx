import ReaderImage from "../ReaderImage/ReaderImage";

type ReaderPageData = {
  index: number;
  url: string;
};

type LongStripReaderProps = {
  pages: ReaderPageData[];
  currentPage: number;
  renderAhead: number;
  targetPage:number|null;
  observePage: (element: HTMLElement | null) => void;
};

function LongStripReader({
  pages,
  currentPage,
  renderAhead,
  targetPage,
  observePage,
}: LongStripReaderProps) {
  const renderFromPage = Math.max(
    currentPage,
    targetPage ?? 0,
  )
  return (
    <div className="reader-long-strip">
      {pages.map((page) => {
        const shouldLoad = page.index <= renderFromPage + renderAhead;
        return (
          <div key={page.index} data-page={page.index+1} ref={observePage}>
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

export default LongStripReader