import { describe, expect, it, vi, beforeEach } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import ReaderPage from "../ReaderPage";

/* =========================================================
 * Mock data
 * ========================================================= */

const mockPages = [
  {
    index: 0,
    url: "page-0.jpg",
  },
  {
    index: 1,
    url: "page-1.jpg",
  },
  {
    index: 2,
    url: "page-2.jpg",
  },
];

const mockChapters = [
  {
    id: "chapter-1",
    title: "Chapter 1",
  },
];

/* =========================================================
 * Mock state
 * ========================================================= */

let mockCurrentPage = 0;

const mockSetCurrentPageFromTracking = vi.fn();
const mockRestorePage = vi.fn();

const mockGoToNextPage = vi.fn(() => {
  if (mockCurrentPage < mockPages.length - 1) {
    mockCurrentPage += 1;
  }
});

const mockGoToPreviousPage = vi.fn(() => {
  if (mockCurrentPage > 0) {
    mockCurrentPage -= 1;
  }
});

const mockGoToPage = vi.fn((page: number) => {
  if (page >= 0 && page < mockPages.length) {
    mockCurrentPage = page;
  }
});

/* =========================================================
 * Router
 * ========================================================= */

vi.mock("react-router-dom", async () => {
  const actual =
    await vi.importActual<typeof import("react-router-dom")>(
      "react-router-dom",
    );

  return {
    ...actual,
    useParams: () => ({
      mangaId: "manga-1",
      chapterId: "chapter-1",
    }),
  };
});

/* =========================================================
 * Reader settings
 * ========================================================= */

vi.mock("../../features/readerSetting/context/ReaderSettingContext", () => ({
  ReaderSettingsProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),

  useReaderSettings: () => ({
    settings: {
      pageMode: "single-page",
      theme: "light",
    },
  }),
}));

/* =========================================================
 * Reader data
 * ========================================================= */

vi.mock("../../features/reader/hooks/useReaderData", () => ({
  useReaderData: () => ({
    pages: mockPages,
    chapters: mockChapters,

    pagesQuery: {
      isPending: false,
      isError: false,
      error: null,
    },

    chaptersQuery: {
      hasNextPage: false,
      fetchNextPage: vi.fn(),
      isFetchingNextPage: false,
      isFetchNextPageError: false,
    },
  }),
}));

/* =========================================================
 * Current reader page
 *
 * IMPORTANT:
 * Do NOT use another independent state here.
 * ReaderPage gets currentPage from this mock.
 * ========================================================= */

vi.mock("../../features/reader/hooks/useCurrentReaderPage", () => ({
  useCurrentReaderPage: () => ({
    get currentPage() {
      return mockCurrentPage;
    },

    setCurrentPageFromTracking: mockSetCurrentPageFromTracking,

    restorePage: mockRestorePage,

    goToNextPage: mockGoToNextPage,

    goToPreviousPage: mockGoToPreviousPage,

    goToPage: mockGoToPage,
  }),
}));

/* =========================================================
 * Progress persistence
 * ========================================================= */

vi.mock("../../features/reader/hooks/useReaderProgressPersistence", () => ({
  useReaderProgressPersistence: () => ({
    restoredPage: null,
    hasRestored: true,
  }),
}));

/* =========================================================
 * Restore position
 * ========================================================= */

vi.mock("../../features/reader/hooks/useReaderRestorePosition", () => ({
  useReaderRestorePosition: vi.fn(),
}));

/* =========================================================
 * Preload
 * ========================================================= */

vi.mock("../../features/reader/hooks/useReaderPreload", () => ({
  useReaderPreload: vi.fn(),
}));

/* =========================================================
 * Long strip virtualizer
 * ========================================================= */

vi.mock("../../features/reader/hooks/useLongStripVirtualizer", () => ({
  useLongStripVirtualizer: () => ({
    parentRef: vi.fn(),
    virtualizer: {},
  }),
}));

/* =========================================================
 * Long strip tracking
 * ========================================================= */

vi.mock("../../features/reader/hooks/useLongStripPageTracking", () => ({
  useLongStripPageTracking: () => ({
    setProgrammaticNavigation: vi.fn(),
  }),
}));

/* =========================================================
 * Long strip navigation
 * ========================================================= */

vi.mock("../../features/reader/hooks/useLongStripNavigation", () => ({
  useLongStripNavigation: () => ({
    targetPage: null,
    scrollToNextPage: vi.fn(),
    scrollToPreviousPage: vi.fn(),
    requestScrollToPage: vi.fn(),
  }),
}));

/* =========================================================
 * Chapter navigation
 * ========================================================= */

vi.mock("../../features/readerNavigation/hooks/useChapterNavigation", () => ({
  useChapterNavigation: () => ({
    hasNext: false,
    hasPrevious: false,

    goNextChapter: vi.fn(),
    goPreviousChapter: vi.fn(),

    navigationStatus: "idle",
  }),
}));

/* =========================================================
 * Reader controls
 *
 * This is the important part.
 *
 * The real ReaderPage calls:
 *
 * useReaderControls({
 *   currentPage,
 *   totalPages,
 *   nextChapter,
 *   previousChapter,
 *   nextPage,
 *   previousPage,
 *   goToPage,
 * })
 *
 * So our mock must return the shape that the toolbar expects.
 * ========================================================= */

vi.mock("../../features/reader/hooks/useReaderControl", () => ({
  useReaderControls: (options: {
    currentPage: number;
    totalPages: number;
    nextPage: () => void;
    previousPage: () => void;
    goToPage: (page: number) => void;
    nextChapter: () => void;
    previousChapter: () => void;
  }) => ({
    nextPage: options.nextPage,
    previousPage: options.previousPage,
    goToPage: options.goToPage,

    nextChapter: options.nextChapter,
    previousChapter: options.previousChapter,
  }),
}));

/* =========================================================
 * Keyboard navigation
 *
 * DO NOT create your own keyboard event listener here.
 *
 * The old test did this and called:
 *
 * controls.nextPage()
 *
 * which does not match the actual hook contract.
 *
 * For ReaderPage tests, keyboard navigation should be tested
 * separately in useKeyboardNavigation.test.tsx.
 * ========================================================= */

vi.mock("../../features/reader/hooks/useKeyboardNavigation", () => ({
  useKeyboardNavigation: vi.fn(),
}));

/* =========================================================
 * Reader toolbar hook
 * ========================================================= */

vi.mock("../../features/readerToolbar/hooks/useReaderToolbar", () => ({
  default: () => ({
    isVisible: true,
    isSettingsOpen: false,

    toggleVisibility: vi.fn(),
    openSettings: vi.fn(),
    closeSettings: vi.fn(),
  }),
}));

/* =========================================================
 * Reader toolbar component
 * ========================================================= */

vi.mock("../../features/readerToolbar/components/ReaderToolbar", () => ({
  default: ({
    currentPage,
    totalPages,
    onPreviousPage,
    onNextPage,
    onPreviousChapter,
    onNextChapter,
    onSettingsClick,
    onToggleVisibility,
  }: {
    currentPage: number;
    totalPages: number;
    onPreviousPage: () => void;
    onNextPage: () => void;
    onPreviousChapter: () => void;
    onNextChapter: () => void;
    onSettingsClick: () => void;
    onToggleVisibility: () => void;
  }) => (
    <header>
      <button
        type="button"
        aria-label="Previous page"
        data-testid="toolbar-previous-page"
        onClick={onPreviousPage}
      >
        Previous page
      </button>

      <button
        type="button"
        aria-label="Next page"
        data-testid="toolbar-next-page"
        onClick={onNextPage}
      >
        Next page
      </button>

      <button
        type="button"
        aria-label={`Go to page ${currentPage + 1} of ${totalPages}`}
      >
        {String(currentPage + 1).padStart(2, "0")}
        {" / "}
        {String(totalPages).padStart(2, "0")}
      </button>

      <button
        type="button"
        aria-label="Previous chapter"
        onClick={onPreviousChapter}
        data-testid="toolbar-previous-chapter"
      >
        Previous chapter
      </button>

      <button
        type="button"
        aria-label="Next chapter"
        onClick={onNextChapter}
        data-testid="toolbar-next-chapter"
      >
        Next chapter
      </button>

      <button
        type="button"
        aria-label="Reader settings"
        onClick={onSettingsClick}
      >
        Settings
      </button>

      <button
        type="button"
        aria-label="Hide reader toolbar"
        onClick={onToggleVisibility}
      >
        Hide toolbar
      </button>
    </header>
  ),
}));

/* =========================================================
 * Reader navigation
 * ========================================================= */

vi.mock("../../features/readerNavigation/components/ReaderNavigation", () => ({
  default: ({
    hasPrevious,
    hasNext,
    onPrevious,
    onNext,
  }: {
    hasPrevious: boolean;
    hasNext: boolean;
    onPrevious: () => void;
    onNext: () => void;
    navigationStatus: string;
  }) => (
    <nav aria-label="Chapter navigation">
      <button
        type="button"
        aria-label="Previous chapter"
        disabled={!hasPrevious}
        onClick={onPrevious}
      >
        Previous
      </button>

      <span>Current chapter</span>

      <button
        type="button"
        aria-label="Next chapter"
        disabled={!hasNext}
        onClick={onNext}
      >
        Next
      </button>
    </nav>
  ),
}));

/* =========================================================
 * Reader progress
 * ========================================================= */

vi.mock("../../features/readerProgress/components/ReaderProgress", () => ({
  ReaderProgress: ({
    currentPage,
    totalPages,
    onGoToPage,
  }: {
    currentPage: number;
    totalPages: number;
    onGoToPage: (page: number) => void;
  }) => (
    <button
      type="button"
      className="reader-progress"
      aria-label={`Current page ${
        currentPage + 1
      } of ${totalPages}. Go to Page`}
      onClick={() => onGoToPage(currentPage)}
    >
      <span>{currentPage + 1}</span>
      <span>/</span>
      <span>{totalPages}</span>
    </button>
  ),
}));

/* =========================================================
 * Reader settings panel
 * ========================================================= */

vi.mock("../../features/readerSetting/components/ReaderSettingsPanel", () => ({
  default: () => <div data-testid="reader-settings-panel">Reader settings</div>,
}));

/* =========================================================
 * LongStripReader
 *
 * Not used in these tests because settings.pageMode is
 * single-page.
 * ========================================================= */

vi.mock(
  "../../features/reader/components/LongStripReader/LongStripReader",
  () => ({
    default: () => <div data-testid="long-strip-reader">Long strip reader</div>,
  }),
);

/* =========================================================
 * ReaderImage
 *
 * Keep the mock simple.
 *
 * This avoids jsdom image-loading behaviour interfering with
 * ReaderPage tests.
 * ========================================================= */

vi.mock("../../features/reader/components/ReaderImage/ReaderImage", () => ({
  default: ({
    src,
    alt,
  }: {
    src: string;
    alt: string;
    shouldLoad: boolean;
  }) => <img src={src} alt={alt} data-testid={alt} />,
}));

/* =========================================================
 * SinglePageReader
 *
 * IMPORTANT:
 *
 * Your actual SinglePageReader maps all pages but only renders
 * the active page visibly through CSS.
 *
 * For ReaderPage integration tests we want to verify the
 * contract between ReaderPage and SinglePageReader.
 *
 * This mock also makes page switching obvious.
 * ========================================================= */

vi.mock(
  "../../features/reader/components/SinglePageReader/SinglePageReader",
  () => ({
    default: ({
      pages,
      currentPage,
      onNextPage,
      onPreviousPage,
    }: {
      pages: {
        index: number;
        url: string;
      }[];
      currentPage: number;
      onNextPage: () => void;
      onPreviousPage: () => void;
    }) => {
      const page = pages[currentPage];

      return (
        <main className="reader-single-page">
          <div
            className="reader-single-page__stage"
            role="region"
            aria-label="Single page reader"
          >
            <div
              className="reader-single-page__item reader-single-page__item--active"
              data-page={currentPage + 1}
            >
              <img src={page.url} alt={`Page ${page.index + 1}`} />
            </div>

            <button
              type="button"
              aria-label="Previous page"
              onClick={onPreviousPage}
              disabled={currentPage <= 0}
            >
              Previous
            </button>

            <button
              type="button"
              aria-label="Next page"
              onClick={onNextPage}
              disabled={currentPage >= pages.length - 1}
            >
              Next
            </button>
          </div>

          <div className="reader-single-page__page-indicator">
            <span>{String(currentPage + 1).padStart(2, "0")}</span>

            <span>/</span>

            <span>{String(pages.length).padStart(2, "0")}</span>
          </div>
        </main>
      );
    },
  }),
);

/* =========================================================
 * Helpers
 * ========================================================= */

function renderReader() {
  return render(
    <MemoryRouter initialEntries={["/reader/manga-1/chapter-1"]}>
      <ReaderPage />
    </MemoryRouter>,
  );
}

/* =========================================================
 * Tests
 * ========================================================= */

describe("ReaderPage", () => {
  beforeEach(() => {
    mockCurrentPage = 0;

    vi.clearAllMocks();
  });

  /* -------------------------------------------------------
   * Initial render
   * ------------------------------------------------------- */

  it("renders the reader", () => {
    renderReader();

    expect(
      screen.getByRole("region", {
        name: "Single page reader",
      }),
    ).toBeInTheDocument();
  });

  it("renders the first page", () => {
    renderReader();

    expect(screen.getByAltText("Page 1")).toBeInTheDocument();

    expect(screen.queryByAltText("Page 2")).not.toBeInTheDocument();

    expect(screen.queryByAltText("Page 3")).not.toBeInTheDocument();
  });

  it("shows the correct initial page indicator", () => {
    renderReader();

    expect(screen.getByText("01")).toBeInTheDocument();

    expect(screen.getByText("03")).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: "Current page 1 of 3. Go to Page",
      }),
    ).toBeInTheDocument();
  });

  /* -------------------------------------------------------
   * Toolbar
   * ------------------------------------------------------- */

  it("renders reader toolbar controls", () => {
    renderReader();

    expect(screen.getByTestId("toolbar-previous-chapter")).toBeInTheDocument();

    expect(screen.getByTestId("toolbar-next-chapter")).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: "Reader settings",
      }),
    ).toBeInTheDocument();
  });

  /* -------------------------------------------------------
   * Next page
   * ------------------------------------------------------- */

  it("calls next page when toolbar next button is clicked", () => {
    renderReader();

    fireEvent.click(screen.getByTestId("toolbar-next-page"));

    expect(mockGoToNextPage).toHaveBeenCalledTimes(1);
  });

  it("calls next page from SinglePageReader", () => {
    renderReader();

    const nextButton = screen.getAllByRole("button", {
      name: "Next page",
    });

    fireEvent.click(nextButton[nextButton.length - 1]);

    expect(mockGoToNextPage).toHaveBeenCalledTimes(1);
  });

  /* -------------------------------------------------------
   * Previous page
   * ------------------------------------------------------- */

  it("calls previous page when toolbar previous button is clicked", () => {
    renderReader();

    fireEvent.click(screen.getByTestId("toolbar-previous-page"));

    expect(mockGoToPreviousPage).toHaveBeenCalledTimes(1);
  });

  /* -------------------------------------------------------
   * Progress
   * ------------------------------------------------------- */

  it("renders ReaderProgress", () => {
    renderReader();

    expect(
      screen.getByRole("button", {
        name: "Current page 1 of 3. Go to Page",
      }),
    ).toBeInTheDocument();
  });

  /* -------------------------------------------------------
   * Page update
   *
   * We simulate the real hook updating currentPage by
   * changing mockCurrentPage and forcing a rerender.
   * ------------------------------------------------------- */

  it("updates the rendered page when currentPage changes", async () => {
    const result = renderReader();

    expect(screen.getByAltText("Page 1")).toBeInTheDocument();

    mockCurrentPage = 1;

    result.rerender(
      <MemoryRouter initialEntries={["/reader/manga-1/chapter-1"]}>
        <ReaderPage />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByAltText("Page 2")).toBeInTheDocument();
    });

    expect(screen.queryByAltText("Page 1")).not.toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: "Current page 2 of 3. Go to Page",
      }),
    ).toBeInTheDocument();
  });

  /* -------------------------------------------------------
   * Page 3
   * ------------------------------------------------------- */

  it("can render the last page", () => {
    mockCurrentPage = 2;

    renderReader();
    const pageIndicator = document.querySelector(
      ".reader-single-page__page-indicator",
    );

    expect(pageIndicator).toBeInTheDocument();
    expect(pageIndicator).toHaveTextContent("03");

    expect(
      screen.getByRole("button", {
        name: "Current page 3 of 3. Go to Page",
      }),
    ).toBeInTheDocument();
  });

  /* -------------------------------------------------------
   * Single page structure
   * ------------------------------------------------------- */

  it("renders the single page reader container", () => {
    renderReader();

    expect(document.querySelector(".reader-single-page")).toBeInTheDocument();

    expect(
      document.querySelector(".reader-single-page__stage"),
    ).toBeInTheDocument();

    expect(
      document.querySelector(".reader-single-page__page-indicator"),
    ).toBeInTheDocument();
  });

  /* -------------------------------------------------------
   * Chapter navigation
   * ------------------------------------------------------- */

  it("disables previous and next chapter when unavailable", () => {
    renderReader();
    const chapterNavigation = screen.getByRole("navigation", {
      name: "Chapter navigation",
    });

    const previousChapterButton = chapterNavigation.querySelector(
      'button[aria-label="Previous chapter"]',
    );

    const nextChapterButton = chapterNavigation.querySelector(
      'button[aria-label="Next chapter"]',
    );

    expect(previousChapterButton).toBeDisabled();
    expect(nextChapterButton).toBeDisabled();
  });

  /* -------------------------------------------------------
   * Invalid URL
   * ------------------------------------------------------- */

  it("renders invalid reader URL when params are missing", async () => {
    const routerModule = await import("react-router-dom");

    vi.spyOn(routerModule, "useParams").mockReturnValueOnce({
      mangaId: undefined,
      chapterId: undefined,
    });

    render(
      <MemoryRouter>
        <ReaderPage />
      </MemoryRouter>,
    );

    expect(screen.getByText("Invalid Reader URL")).toBeInTheDocument();
  });
});
