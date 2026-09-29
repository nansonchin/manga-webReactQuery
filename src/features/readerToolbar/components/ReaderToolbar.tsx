import "./ReaderToolbar.scss";

type ReaderToolbarProps = {
  currentPage: number;
  totalPages: number;

  hasPreviousChapter: boolean;
  hasNextChapter: boolean;

  isNavigationLoading?: boolean;

  isVisible: boolean;
  isSettingsOpen: boolean;

  onPreviousPage: () => void;
  onNextPage: () => void;

  onPreviousChapter: () => void;
  onNextChapter: () => void;

  onProgressClick: () => void;
  onSettingsClick: () => void;
  onToggleVisibility: () => void;
};

function ReaderToolbar({
  currentPage,
  totalPages,
  hasPreviousChapter,
  hasNextChapter,
  isNavigationLoading = false,
  isVisible,
  isSettingsOpen,
  onPreviousPage,
  onNextPage,
  onPreviousChapter,
  onNextChapter,
  onProgressClick,
  onSettingsClick,
  onToggleVisibility,
}: ReaderToolbarProps) {
  if (!isVisible) {
    return (
      <button
        type="button"
        className="reader-toolbar-show"
        onClick={onToggleVisibility}
        aria-label="Show reader toolbar"
      >
        <span />
        <span />
        <span />
      </button>
    );
  }

  const displayPage = currentPage + 1;

  return (
    <header
      className={`reader-toolbar ${
        isSettingsOpen ? "reader-toolbar--settings-open" : ""
      }`}
    >
      <div className="reader-toolbar__inner">
        <div className="reader-toolbar__brand">
          <div className="reader-toolbar__crest">
            B
          </div>

          <div className="reader-toolbar__title">
            <span className="reader-toolbar__title-main">
              READER
            </span>

            <span className="reader-toolbar__title-sub">
              MANGA ARCHIVE
            </span>
          </div>
        </div>

        <div className="reader-toolbar__chapter-navigation">
          <button
            type="button"
            className="reader-toolbar__button"
            onClick={onPreviousChapter}
            disabled={
              !hasPreviousChapter ||
              isNavigationLoading
            }
            aria-label="Previous chapter"
          >
            <span className="reader-toolbar__button-icon">
              ‹
            </span>

            <span className="reader-toolbar__button-label">
              Chapter
            </span>
          </button>

          <div className="reader-toolbar__chapter-divider" />

          <button
            type="button"
            className="reader-toolbar__button"
            onClick={onNextChapter}
            disabled={
              !hasNextChapter ||
              isNavigationLoading
            }
            aria-label="Next chapter"
          >
            <span className="reader-toolbar__button-label">
              Chapter
            </span>

            <span className="reader-toolbar__button-icon">
              ›
            </span>
          </button>
        </div>

        <div className="reader-toolbar__page">
          <button
            type="button"
            className="reader-toolbar__page-button"
            onClick={onProgressClick}
            aria-label={`Go to page ${displayPage} of ${totalPages}`}
          >
            <span className="reader-toolbar__page-current">
              {String(displayPage).padStart(2, "0")}
            </span>

            <span className="reader-toolbar__page-separator">
              /
            </span>

            <span className="reader-toolbar__page-total">
              {String(totalPages).padStart(2, "0")}
            </span>
          </button>
        </div>

        <div className="reader-toolbar__page-navigation">
          <button
            type="button"
            className="reader-toolbar__icon-button"
            onClick={onPreviousPage}
            disabled={isNavigationLoading}
            aria-label="Previous page"
          >
            ←
          </button>

          <button
            type="button"
            className="reader-toolbar__icon-button"
            onClick={onNextPage}
            disabled={isNavigationLoading}
            aria-label="Next page"
          >
            →
          </button>
        </div>

        <div className="reader-toolbar__actions">
          <button
            type="button"
            className={`reader-toolbar__settings-button ${
              isSettingsOpen
                ? "reader-toolbar__settings-button--active"
                : ""
            }`}
            onClick={onSettingsClick}
            aria-label="Reader settings"
            aria-expanded={isSettingsOpen}
          >
            <span className="reader-toolbar__settings-icon">
              ⚙
            </span>

            <span className="reader-toolbar__settings-label">
              Settings
            </span>
          </button>

          <button
            type="button"
            className="reader-toolbar__collapse-button"
            onClick={onToggleVisibility}
            aria-label="Hide reader toolbar"
          >
            −
          </button>
        </div>
      </div>

      {isNavigationLoading && (
        <div
          className="reader-toolbar__loading"
          aria-label="Loading"
        />
      )}
    </header>
  );
}

export default ReaderToolbar;



