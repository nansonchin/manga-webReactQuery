import { useReaderTapNavigation } from "../../hooks/useReaderTapNavigation";
import ReaderImage from "../ReaderImage/ReaderImage";
import "./SinglePageReader.scss";


type ReaderPageData = {
  index: number;
  url: string;
};


type SinglePageReaderProps = {
  pages: ReaderPageData[];
  currentPage: number;
  onNextPage: () => void;
  onPreviousPage: () => void;
};


function SinglePageReader({
  pages,
  currentPage,
  onNextPage,
  onPreviousPage,
}: SinglePageReaderProps) {
  const { handleTap } = useReaderTapNavigation({
    previous: onPreviousPage,
    next: onNextPage,
  });


  const currentPageData = pages[currentPage];


  if (!currentPageData) {
    return (
      <main className="reader-single-page">
        <div
          className="reader-single-page__stage"
          role="region"
          aria-label="Single page reader"
        >
          <div className="reader-single-page__empty">
            No page available
          </div>
        </div>


        <div className="reader-single-page__page-indicator">
          <span className="reader-single-page__page-current">
            00
          </span>


          <span className="reader-single-page__page-divider">
            /
          </span>


          <span className="reader-single-page__page-total">
            {String(pages.length).padStart(2, "0")}
          </span>
        </div>
      </main>
    );
  }


  return (
    <main className="reader-single-page">
      <div
        className="reader-single-page__stage"
        onClick={handleTap}
        role="region"
        aria-label="Single page reader"
      >
        <div
          className="reader-single-page__item reader-single-page__item--active"
          data-page={currentPageData.index + 1}
        >
          <ReaderImage
            src={currentPageData.url}
            alt={`Page ${currentPageData.index + 1}`}
            shouldLoad={true}
          />
        </div>
      </div>


      <div className="reader-single-page__page-indicator">
        <span className="reader-single-page__page-current">
          {String(currentPage + 1).padStart(2, "0")}
        </span>


        <span className="reader-single-page__page-divider">
          /
        </span>


        <span className="reader-single-page__page-total">
          {String(pages.length).padStart(2, "0")}
        </span>
      </div>
    </main>
  );
}


export default SinglePageReader;
