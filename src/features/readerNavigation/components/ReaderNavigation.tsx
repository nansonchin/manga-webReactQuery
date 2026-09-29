import "./ReaderNavigation.scss";
// type Chapter={
//     id:string;
// }

type NavigationStatus = "idle" | "loading" | "error";

type ReaderNavigationProps = {
  // previousChapter:Chapter|null
  // nextChapter:Chapter|null
  hasPrevious: boolean;
  hasNext: boolean;
  onPrevious: () => void;
  onNext: () => void;
  navigationStatus: NavigationStatus;
};

function ReaderNavigation({
  // previousChapter,
  // nextChapter,
  hasPrevious,
  hasNext,
  onPrevious,
  onNext,
  navigationStatus,
}: ReaderNavigationProps) {
  const isLoading = navigationStatus === "loading";
  const isError = navigationStatus === "error";
  return (
    <nav className="reader-navigation" aria-label="Chapter navigation">
      <div className="reader-navigation-inner">
        <button
          type="button"
          className="reader-navigation-button"
          disabled={!hasPrevious || isLoading}
          onClick={onPrevious}
          aria-label="Previous chapter"
        >
          <span className="reader-navigation-arrow" aria-hidden="true">
            {"<"}
          </span>
          <span className="reader-navigation-button-label">Previous</span>
        </button>
        <div className="reader-navigation-center">
          <span className="reader-navigation-eyebrow">READING</span>
          <span className="reader-navigation-title">CURRENT CHAPTER</span>
          {isLoading && (
            <span className="reader-navigation-status">Loading ...</span>
          )}
          {isError && (
            <span className="reader-navigation-status reader-navigation-status-error">
              Navigation failed
            </span>
          )}
        </div>
        <button
          type="button"
          className="reader-navigation-button reader-navigation-button-next"
          disabled={!hasNext || isLoading}
          onClick={onNext}
          aria-label="Next chapter"
        >
          <span className="reader-navigation-button-label"> Next </span>
          <span className="reader-navigation-arrow" aria-hidden="true">
            ›
          </span>
        </button>
      </div>
      <div className="reader-navigation-accent" aria-hidden="true" />
    </nav>
  );
}

export default ReaderNavigation;
