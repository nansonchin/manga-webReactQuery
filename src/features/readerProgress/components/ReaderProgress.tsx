import { useState } from "react";
import "./readerProgress.scss";
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
  const displayPage = currentPage + 1;

  const handleOpen = () => {
    setPageInput(String(displayPage));
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleSubmit = () => {
    const page = Number(pageInput);
    if (!Number.isInteger(page)) {
      return;
    }

    if (page < 1 || page > totalPages) {
      return;
    }

    onGoToPage(page);
    setIsOpen(false);
  };

  return (
    <React.Fragment>
      <button type="button" className="reader-progress" onClick={()=>handleOpen()}>
        <div
          className="reader-progress"
          aria-label={`Page ${displayPage} of ${totalPages}`}
        >
          <span>{displayPage}</span>
          <span aria-hidden="true">/</span>
          <span>{totalPages}</span>
        </div>
      </button>
      {
        isOpen && (
            <div className="reader-progress-overlay">
                <div className="reader-progress-dialog">
                    <h2>Go to page</h2>
                    <input type="number" 
                        min={1} 
                        max={totalPages} 
                        value={pageInput} 
                        onChange={(event)=>setPageInput(event.target.value)} 
                        autoFocus
                    />
                    <div className="reader-progress-action">
                        <button type="button" onClick={handleClose}>
                            Cancel
                        </button>
                        <button type="button" onClick={handleSubmit}>
                            Go
                        </button>
                    </div>
                    <p>Page 1 - {totalPages}</p>
                </div>

            </div>
        )
      }
    </React.Fragment>
  );
}
