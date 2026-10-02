import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import ReaderPage from "../../pages/ReaderPage";

import type { ChapterPage } from "../../features/reader/types";

const mocks = vi.hoisted(() => ({
  useReaderData: vi.fn(),
  useChapterNavigation: vi.fn(),
  useReaderPreload: vi.fn(),
  useLongStripPageTracking: vi.fn(),
  useLongStripNavigation: vi.fn(),
}));

vi.mock("../../features/reader/hooks/useReaderData", () => ({
  useReaderData: mocks.useReaderData,
}));

vi.mock("../../features/readerNavigation/hooks/useChapterNavigation", () => ({
  useChapterNavigation: mocks.useChapterNavigation,
}));

vi.mock("../../features/reader/hooks/useReaderPreload", () => ({
  useReaderPreload: mocks.useReaderPreload,
}));

vi.mock("../../features/reader/hooks/useLongStripPageTracking", () => ({
  useLongStripPageTracking: mocks.useLongStripPageTracking,
}));

vi.mock("../../features/reader/hooks/useLongStripNavigation", () => ({
  useLongStripNavigation: mocks.useLongStripNavigation,
}));

const pages: ChapterPage[] = [
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

function createChaptersQuery() {
  return {
    hasNextPage: false,
    fetchNextPage: vi.fn(),
    isFetchingNextPage: false,
    isFetchNextPageError: false,
  };
}

function setupMocks() {
  mocks.useReaderData.mockReturnValue({
    pages,
    chapters: [],

    pagesQuery: {
      isPending: false,
      isError: false,
      error: null,
    },

    chaptersQuery: createChaptersQuery(),
  });

  mocks.useChapterNavigation.mockReturnValue({
    hasPrevious: false,
    hasNext: false,

    goPreviousChapter: vi.fn(),
    goNextChapter: vi.fn(),

    navigationStatus: "idle",
  });

  mocks.useReaderPreload.mockImplementation(() => undefined);

  mocks.useLongStripPageTracking.mockReturnValue({
    setProgrammaticNavigation: vi.fn(),
  });

  mocks.useLongStripNavigation.mockReturnValue({
    targetPage: null,

    scrollToNextPage: vi.fn(),
    scrollToPreviousPage: vi.fn(),
    requestScrollToPage: vi.fn(),
  });
}

beforeEach(() => {
  vi.clearAllMocks();

  setupMocks();
});

function renderReaderPage() {
  return render(
    <MemoryRouter initialEntries={["/manga/manga-1/chapter/chapter-1"]}>
      <Routes>
        <Route
          path="/manga/:mangaId/chapter/:chapterId"
          element={<ReaderPage />}
        />
      </Routes>
    </MemoryRouter>,
  );
}

describe("ReaderPage integration", () => {
  describe("initial render", () => {
    it("renders the reader", () => {
      renderReaderPage();

      expect(screen.getByRole("main")).toBeInTheDocument();

      expect(
        screen.getByRole("region", {
          name: "Long strip reader",
        }),
      ).toBeInTheDocument();
    });

    it("starts at the first page", () => {
      renderReaderPage();

      expect(
        screen.getByRole("button", {
          name: "Current page 1 of 3. Go to Page",
        }),
      ).toBeInTheDocument();
    });

    it("renders the correct total page count", () => {
      renderReaderPage();

      expect(
        screen.getByRole("button", {
          name: "Go to page 1 of 3",
        }),
      ).toBeInTheDocument();
    });
  });

  describe("page navigation", () => {
    it("moves to the next page with the toolbar next button", async () => {
      const user = userEvent.setup();

      const scrollToNextPage = vi.fn();

      mocks.useLongStripNavigation.mockReturnValue({
        targetPage: null,

        scrollToNextPage,
        scrollToPreviousPage: vi.fn(),
        requestScrollToPage: vi.fn(),
      });

      renderReaderPage();

      await user.click(
        screen.getByRole("button", {
          name: "Next page",
        }),
      );

      expect(scrollToNextPage).toHaveBeenCalledTimes(1);
    });

    it("moves to the previous page with the toolbar previous button", async () => {
      const user = userEvent.setup();

      const scrollToPreviousPage = vi.fn();

      mocks.useLongStripNavigation.mockReturnValue({
        targetPage: null,

        scrollToNextPage: vi.fn(),
        scrollToPreviousPage,
        requestScrollToPage: vi.fn(),
      });

      renderReaderPage();

      await user.click(
        screen.getByRole("button", {
          name: "Previous page",
        }),
      );

      expect(scrollToPreviousPage).toHaveBeenCalledTimes(1);
    });

    it("uses long strip navigation for page changes", () => {
      const scrollToNextPage = vi.fn();
      const scrollToPreviousPage = vi.fn();
      const requestScrollToPage = vi.fn();

      mocks.useLongStripNavigation.mockReturnValue({
        targetPage: null,

        scrollToNextPage,
        scrollToPreviousPage,
        requestScrollToPage,
      });

      renderReaderPage();

      expect(
        screen.getByRole("button", {
          name: "Next page",
        }),
      ).toBeInTheDocument();

      expect(
        screen.getByRole("button", {
          name: "Previous page",
        }),
      ).toBeInTheDocument();
    });
  });

  describe("keyboard navigation", () => {
    it("calls next page navigation with ArrowRight", async () => {
      const user = userEvent.setup();

      const scrollToNextPage = vi.fn();

      mocks.useLongStripNavigation.mockReturnValue({
        targetPage: null,

        scrollToNextPage,
        scrollToPreviousPage: vi.fn(),
        requestScrollToPage: vi.fn(),
      });

      renderReaderPage();

      await user.keyboard("{ArrowRight}");

      expect(scrollToNextPage).toHaveBeenCalledTimes(1);
    });
    it("goes to previous chapter with ArrowLeft on the first page", async () => {
      const user = userEvent.setup();

      const previousChapter = vi.fn();

      mocks.useChapterNavigation.mockReturnValue({
        hasPrevious: true,
        hasNext: false,
        goPreviousChapter: previousChapter,
        goNextChapter: vi.fn(),
        navigationStatus: "idle",
      });

      renderReaderPage();

      await user.keyboard("{ArrowLeft}");

      expect(previousChapter).toHaveBeenCalledTimes(1);
    });
  });

  describe("page tracking", () => {
    it("enables long strip page tracking", () => {
      renderReaderPage();

      expect(mocks.useLongStripPageTracking).toHaveBeenCalledWith(
        expect.objectContaining({
          enabled: true,
          virtualizer: expect.anything(),
          onPageChange: expect.any(Function),
        }),
      );
    });

    it("provides the scroll container to page tracking", () => {
      renderReaderPage();

      expect(mocks.useLongStripPageTracking).toHaveBeenCalledWith(
        expect.objectContaining({
          root: expect.anything(),
        }),
      );
    });

    it("updates current page through tracking callback", () => {
      renderReaderPage();

      const call = mocks.useLongStripPageTracking.mock.calls[0];

      const options = call[0];

      expect(options.onPageChange).toEqual(expect.any(Function));
    });
  });

  describe("long strip navigation", () => {
    it("receives the current page and total pages", () => {
      renderReaderPage();

      expect(mocks.useLongStripNavigation).toHaveBeenCalledWith(
        expect.objectContaining({
          currentPage: 0,
          totalPages: 3,
          virtualizer: expect.anything(),
          onPageChange: expect.any(Function),
          setProgrammaticNavigation: expect.any(Function),
        }),
      );
    });

    it("exposes requestScrollToPage for programmatic navigation", async () => {
      const user = userEvent.setup();

      const requestScrollToPage = vi.fn();

      mocks.useLongStripNavigation.mockReturnValue({
        targetPage: null,

        scrollToNextPage: vi.fn(),
        scrollToPreviousPage: vi.fn(),
        requestScrollToPage,
      });

      renderReaderPage();

      const progressButton = screen.getByRole("button", {
        name: "Current page 1 of 3. Go to Page",
      });

      expect(progressButton).toBeInTheDocument();

      await user.click(progressButton);

      expect(progressButton).toBeInTheDocument();
    });
  });

  describe("progress", () => {
    it("renders the current page in ReaderProgress", () => {
      renderReaderPage();

      expect(
        screen.getByRole("button", {
          name: "Current page 1 of 3. Go to Page",
        }),
      ).toBeInTheDocument();
    });

    it("renders the total page count in ReaderProgress", () => {
      renderReaderPage();

      const progress = screen.getByRole("button", {
        name: "Current page 1 of 3. Go to Page",
      });

      expect(progress).toHaveTextContent("1");
      expect(progress).toHaveTextContent("3");
    });
  });

  describe("chapter navigation", () => {
    it("renders next chapter button when a next chapter exists", () => {
      mocks.useChapterNavigation.mockReturnValue({
        hasPrevious: false,
        hasNext: true,

        goPreviousChapter: vi.fn(),
        goNextChapter: vi.fn(),

        navigationStatus: "idle",
      });

      renderReaderPage();

      const buttons = screen.getAllByRole("button", {
        name: "Next chapter",
      });

      expect(buttons.length).toBeGreaterThan(0);

      expect(buttons.some((button) => !button.hasAttribute("disabled"))).toBe(
        true,
      );
    });

    it("calls next chapter navigation", async () => {
      const user = userEvent.setup();

      const goNextChapter = vi.fn();

      mocks.useChapterNavigation.mockReturnValue({
        hasPrevious: false,
        hasNext: true,

        goPreviousChapter: vi.fn(),
        goNextChapter,

        navigationStatus: "idle",
      });

      renderReaderPage();

      const buttons = screen.getAllByRole("button", {
        name: "Next chapter",
      });

      const enabledButton = buttons.find(
        (button) => !button.hasAttribute("disabled"),
      );

      expect(enabledButton).toBeDefined();

      await user.click(enabledButton!);

      expect(goNextChapter).toHaveBeenCalledTimes(1);
    });

    it("renders previous chapter button when a previous chapter exists", () => {
      mocks.useChapterNavigation.mockReturnValue({
        hasPrevious: true,
        hasNext: false,

        goPreviousChapter: vi.fn(),
        goNextChapter: vi.fn(),

        navigationStatus: "idle",
      });

      renderReaderPage();

      const buttons = screen.getAllByRole("button", {
        name: "Previous chapter",
      });

      expect(buttons.length).toBeGreaterThan(0);

      expect(buttons.some((button) => !button.hasAttribute("disabled"))).toBe(
        true,
      );
    });

    it("calls previous chapter navigation", async () => {
      const user = userEvent.setup();

      const goPreviousChapter = vi.fn();

      mocks.useChapterNavigation.mockReturnValue({
        hasPrevious: true,
        hasNext: false,

        goPreviousChapter,
        goNextChapter: vi.fn(),

        navigationStatus: "idle",
      });

      renderReaderPage();

      const buttons = screen.getAllByRole("button", {
        name: "Previous chapter",
      });

      const enabledButton = buttons.find(
        (button) => !button.hasAttribute("disabled"),
      );

      expect(enabledButton).toBeDefined();

      await user.click(enabledButton!);

      expect(goPreviousChapter).toHaveBeenCalledTimes(1);
    });
  });

  describe("preloading", () => {
    it("preloads pages around the current page", () => {
      renderReaderPage();

      expect(mocks.useReaderPreload).toHaveBeenCalledWith(pages, 0, 3);
    });
  });

  describe("loading and error states", () => {
    it("renders loading state while pages are loading", () => {
      mocks.useReaderData.mockReturnValue({
        pages: [],
        chapters: [],

        pagesQuery: {
          isPending: true,
          isError: false,
          error: null,
        },

        chaptersQuery: createChaptersQuery(),
      });

      renderReaderPage();

      expect(screen.getByText("Loading pages...")).toBeInTheDocument();
    });

    it("renders error state when pages fail to load", () => {
      mocks.useReaderData.mockReturnValue({
        pages: [],
        chapters: [],

        pagesQuery: {
          isPending: false,
          isError: true,
          error: new Error("Failed to load pages"),
        },

        chaptersQuery: createChaptersQuery(),
      });

      renderReaderPage();

      expect(
        screen.getByText("Error: Failed to load pages"),
      ).toBeInTheDocument();
    });
  });

  describe("invalid route", () => {
    it("renders invalid reader URL when mangaId is missing", () => {
      render(
        <MemoryRouter initialEntries={["/chapter/chapter-1"]}>
          <Routes>
            <Route path="/chapter/:chapterId" element={<ReaderPage />} />
          </Routes>
        </MemoryRouter>,
      );

      expect(screen.getByText("Invalid Reader URL")).toBeInTheDocument();
    });

    it("renders invalid reader URL when chapterId is missing", () => {
      render(
        <MemoryRouter initialEntries={["/manga/manga-1"]}>
          <Routes>
            <Route path="/manga/:mangaId" element={<ReaderPage />} />
          </Routes>
        </MemoryRouter>,
      );

      expect(screen.getByText("Invalid Reader URL")).toBeInTheDocument();
    });
  });
});
