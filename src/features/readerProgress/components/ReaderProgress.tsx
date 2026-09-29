import { useEffect, useState } from "react";
import "./ReaderProgress.scss";
import React from "react";

type ReaderProgressProps = {
  currentPage: number;
  totalPages: number;
  onGoToPage: (page: number) => void;
};

export function ReaderProgress({
  currentPage,
  totalPages,
  onGoToPage,
}: ReaderProgressProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [pageInput, setPageInput] = useState(String(currentPage + 1));
  const [error, setError] = useState("");
  const displayPage = currentPage + 1;

  const handleOpen = () => {
    setPageInput(String(displayPage));
    setError("");
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setError("");
  };

  const handleSubmit = () => {
    const page = Number(pageInput);
    if (!Number.isInteger(page)) {
      setError("Enter a valid page number");
      return;
    }

    if (page < 1 || page > totalPages) {
      setError(`Enter a page between 1 and ${totalPages}.`);
      return;
    }

    onGoToPage(page - 1);
    setIsOpen(false);
    setError("");
  };

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleClose();
      }
      if (event.key === "Enter") {
        handleSubmit();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, pageInput, totalPages]);

  return (
    <React.Fragment>
      <button
        type="button"
        className="reader-progress"
        onClick={handleOpen}
        aria-label={`Current  page ${displayPage} of ${totalPages}. Go to Page`}
      >
        <span className="reader-progress-current">{displayPage}</span>
        <span className="reader-progress-divider" aria-hidde="true">
          /
        </span>
        <span className="reader-progress-total">{totalPages}</span>
      </button>

      {isOpen && (
        <div
          className="reader-progress-overlay"
          role="presentation"
          onMouseDown={(event) => {
            if (event.currentTarget === event.target) {
              handleClose();
            }
          }}
        >
          <section
            className="reader-progress-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="reader-progress-title"
          >
            <div className="reader-progress-dialog-header">
              <div>
                <span className="reader-progress-eyebrow">READER</span>
                <h2 id="reader-progress-title">Go to Page</h2>
              </div>
              <button
                type="button"
                className="reader-progress-close"
                onClick={handleClose}
                aria-label="Close Page Navigation"
              >
                <span aria-hidden="true">x</span>
              </button>
            </div>

            <div className="reader-progress-field">
              <label htmlFor="reader-page-input">Page</label>
              <div
                className={`reader-progress-input-wrapper ${error ? "has-error" : ""}`}
              >
                <input
                  id="reader-page-input"
                  type="number"
                  min={1}
                  max={totalPages}
                  inputMode="numeric"
                  value={pageInput}
                  autoFocus
                  aria-invalid={Boolean(error)}
                  aria-describedby={
                    error ? "reader-progress-error" : "reader-progress-help"
                  }
                  onChange={(event) => {
                    setPageInput(event.target.value);
                    if (error) {
                      setError("");
                    }
                  }}
                />
                <span className="reader-progress-input-total">
                  / {totalPages}
                </span>
              </div>
              {error ? (
                <p
                  id="reader-progress-error"
                  className="reader-progress-error"
                  role="alert"
                >
                  {error}
                </p>
              ) : (
                <p id="reader-progress-help" className="reader-progress-help">
                  Enter a page number from 1 to {totalPages}
                </p>
              )}
            </div>
            <div>
              <button
                type="button"
                className="reader-progress-cancel"
                onClick={handleClose}
              >
                Cancel
              </button>
              <button
                type="button"
                className="reader-progress-submit"
                onClick={handleSubmit}
              >
                Go to page
                <span aria-hidden="true"> {`>`} </span>
              </button>
            </div>
            <div className="reader-progress-footer">
              <span>
                <kbd>Close</kbd>
              </span>
              <span>
                <kbd>ENTER</kbd>Go
              </span>
            </div>
          </section>
        </div>
      )}
    </React.Fragment>
  );
}
