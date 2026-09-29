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


  return (
    <main className="reader-single-page">
      <div
        className="reader-single-page__stage"
        onClick={handleTap}
        role="region"
        aria-label="Single page reader"
      >
        {pages.map((page) => {
          const isCurrent = page.index === currentPage;


          return (
            <div
              key={page.index}
              className={
                isCurrent
                  ? "reader-single-page__item reader-single-page__item--active"
                  : "reader-single-page__item"
              }
              data-page={page.index + 1}
              aria-hidden={!isCurrent}
            >
              {isCurrent && (
                <ReaderImage
                  src={page.url}
                  alt={`Page ${page.index + 1}`}
                  shouldLoad={true}
                />
              )}
            </div>
          );
        })}


        <button
          type="button"
          className="reader-single-page__tap-zone reader-single-page__tap-zone--previous"
          onClick={(event) => {
            event.stopPropagation();
            onPreviousPage();
          }}
          aria-label="Previous page"
          disabled={currentPage <= 0}
        />


        <button
          type="button"
          className="reader-single-page__tap-zone reader-single-page__tap-zone--next"
          onClick={(event) => {
            event.stopPropagation();
            onNextPage();
          }}
          aria-label="Next page"
          disabled={currentPage >= pages.length - 1}
        />
      </div>


      <div className="reader-single-page__page-indicator">
        <span className="reader-single-page__page-current">
          {String(currentPage + 1).padStart(2, "0")}
        </span>


        <span className="reader-single-page__page-divider">/</span>


        <span className="reader-single-page__page-total">
          {String(pages.length).padStart(2, "0")}
        </span>
      </div>
    </main>
  );
}


export default SinglePageReader;





