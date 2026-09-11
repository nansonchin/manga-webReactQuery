import ReaderImage from "../ReaderImage/ReaderImage";

type ReaderPageData = {
  index: number;
  url: string;
};

type LongStripReaderProps = {
  pages: ReaderPageData[];
  currentPage: number;
  renderAhead: number;
  observePage: (element: HTMLElement | null) => void;
};

function LongStripReader({
  pages,
  currentPage,
  renderAhead,
  observePage,
}: LongStripReaderProps) {
  return (
    <div className="reader-long-strip">
      {pages.map((page) => {
        const shouldLoad = page.index <= currentPage + renderAhead;
        return (
          <div>
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