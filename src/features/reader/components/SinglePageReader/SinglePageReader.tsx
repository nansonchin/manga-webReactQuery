import { useReaderTapNavigation } from "../../hooks/useReaderTapNavigation";
import type { ChapterPage } from "../../types";
import ReaderImage from "../ReaderImage/ReaderImage";
import "./SinglePageReader.scss";

type SinglePageReaderProps = {
  pages: ChapterPage[];
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

  const displayCurrent = currentPage
    ? String(currentPage + 1).padStart(2, "0")
    : "00";
  const displayTotal = String(pages.length).padStart(2, "0");

  return (
    <main className="reader-single-page">
      <div
        className="reader-single-page__stage"
        onClick={currentPage? handleTap: undefined}
        role="region"
        aria-label="Single page reader"
      >
        {currentPageData ? (
          <div
            key={currentPageData.index}
            className="reader-single-page__item reader-single-page__item--active"
            data-page={currentPageData.index + 1}
          >
            <ReaderImage
              src={currentPageData.url}
              alt={`Page ${currentPageData.index + 1}`}
              shouldLoad={true}
            />
          </div>
        ) : (
          <div className="reader-single-page__empty">No page available</div>
        )}
      </div>

       <div className="reader-single-page__page-indicator">
        <span className="reader-single-page__page-current">
          {displayCurrent}
        </span>
        <span className="reader-single-page__page-divider">/</span>
        <span className="reader-single-page__page-total">{displayTotal}</span>
      </div>
    </main>
  );
}

export default SinglePageReader;
