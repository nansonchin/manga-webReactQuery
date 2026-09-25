import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import ReaderPage from "../ReaderPage";

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

vi.mock("../../features/reader/components/ReaderImage/ReaderImage", () => ({
  default: ({ src, alt }: { src: string; alt: string }) => (
    <img src={src} alt={alt} />
  ),
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

function setupMocks() {
  mocks.useReaderData.mockReturnValue({
    pages,

    chapters: [],

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
  });

  mocks.useChapterNavigation.mockReturnValue({
    previousChapter: null,
    nextChapter: null,

    goPreviousChapter: vi.fn(),
    goNextChapter: vi.fn(),

    hasPrevious: false,
    hasNext: false,

    pendingNavigation: null,

    navigationStatus: "idle",

    needsMoreChapters: false,
  });

  mocks.useReaderPreload.mockImplementation(() => {});

  mocks.useLongStripPageTracking.mockReturnValue({
    observePage: vi.fn(),
  });

  mocks.useLongStripNavigation.mockReturnValue({
    targetPage: null,

    scrollToNextPage: vi.fn(),

    scrollToPreviousPage: vi.fn(),

    requestScrollToPage: vi.fn(),
  });
}

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

async function switchToSinglePage() {
  const user = userEvent.setup();

  const button = screen.getByRole("button", {
    name: "Single Page",
  });

  await user.click(button);
}

function mockReaderBoundingBox(reader: HTMLElement) {
  vi.spyOn(reader, "getBoundingClientRect").mockReturnValue({
    left: 0,
    right: 1000,

    top: 0,
    bottom: 1000,

    width: 1000,
    height: 1000,

    x: 0,
    y: 0,

    toJSON: () => ({}),
  } as DOMRect);
}

function getSinglePageReader() {
  const reader = document.querySelector(".reader-single-page");

  expect(reader).toBeInTheDocument();

  return reader as HTMLElement;
}

describe("ReaderPage", () => {

  beforeEach(()=>{
    vi.clearAllMocks()
    localStorage.clear()
    setupMocks()
  })

  it("renders the first page initially", () => {
    setupMocks();

    renderReaderPage();

    expect(screen.getByText("Current Page : 1")).toBeInTheDocument();

    expect(screen.getByAltText("Page 1")).toBeInTheDocument();

    expect(screen.getByAltText("Page 2")).toBeInTheDocument();

    expect(screen.getByAltText("Page 3")).toBeInTheDocument();
  });

  it("moves to the next page when the user clicks the right half", async () => {
    setupMocks();

    renderReaderPage();

    await switchToSinglePage();

    expect(screen.getByText("Current Page : 1")).toBeInTheDocument();

    const reader = getSinglePageReader();

    mockReaderBoundingBox(reader);

    fireEvent.click(reader, {
      clientX: 750,
      clientY: 500,
    });

    expect(screen.getByText("Current Page : 2")).toBeInTheDocument();
  });

  it("moves to the previous page when the user clicks the left half", async () => {
    setupMocks();

    renderReaderPage();

    await switchToSinglePage();

    const reader = getSinglePageReader();

    mockReaderBoundingBox(reader);

    fireEvent.click(reader, {
      clientX: 750,
      clientY: 500,
    });

    expect(screen.getByText("Current Page : 2")).toBeInTheDocument();

    fireEvent.click(reader, {
      clientX: 250,
      clientY: 500,
    });

    expect(screen.getByText("Current Page : 1")).toBeInTheDocument();
  });

  it("does not move before the first page", async () => {
    setupMocks();

    renderReaderPage();

    await switchToSinglePage();

    const reader = getSinglePageReader();

    mockReaderBoundingBox(reader);


    fireEvent.click(reader, {
      clientX: 250,
      clientY: 500,
    });

    expect(screen.getByText("Current Page : 1")).toBeInTheDocument();
  });

  it("does not move after the last page", async () => {
    setupMocks();

    renderReaderPage();

    await switchToSinglePage();

    const reader = getSinglePageReader();

    mockReaderBoundingBox(reader);

    fireEvent.click(reader, {
      clientX: 750,
      clientY: 500,
    });

    fireEvent.click(reader, {
      clientX: 750,
      clientY: 500,
    });

    expect(screen.getByText("Current Page : 3")).toBeInTheDocument();

    fireEvent.click(reader, {
      clientX: 750,
      clientY: 500,
    });

    expect(screen.getByText("Current Page : 3")).toBeInTheDocument();
  });


  it("updates the reader progress when the current page changes", async () => {
    setupMocks();

    renderReaderPage();

    await switchToSinglePage();

    const reader = getSinglePageReader();

    mockReaderBoundingBox(reader);

    expect(screen.getByLabelText("Page 1 of 3")).toBeInTheDocument();

    fireEvent.click(reader, {
      clientX: 750,
      clientY: 500,
    });

    expect(screen.getByLabelText("Page 2 of 3")).toBeInTheDocument();
  });

  it("passes chapter navigation state to ReaderNavigation", () => {
    const goPreviousChapter = vi.fn();
    const goNextChapter = vi.fn();

    setupMocks();

    mocks.useChapterNavigation.mockReturnValue({
      previousChapter: {
        id: "chapter-0",
      },

      nextChapter: {
        id: "chapter-2",
      },

      goPreviousChapter,
      goNextChapter,

      hasPrevious: true,
      hasNext: true,

      pendingNavigation: null,

      navigationStatus: "idle",

      needsMoreChapters: false,
    });

    renderReaderPage();

    expect(
      screen.getByRole("button", {
        name: "Previous Button",
      }),
    ).not.toBeDisabled();

    expect(
      screen.getByRole("button", {
        name: "Next Chapter",
      }),
    ).not.toBeDisabled();
  });

  it("renders loading state while pages are loading", () => {
    setupMocks();

    mocks.useReaderData.mockReturnValue({
      pages: [],
      chapters: [],

      pagesQuery: {
        isPending: true,
        isError: false,
        error: null,
      },

      chaptersQuery: {
        hasNextPage: false,
        fetchNextPage: vi.fn(),
        isFetchingNextPage: false,
        isFetchNextPageError: false,
      },
    });

    renderReaderPage();

    expect(screen.getByText("Loading pages ...")).toBeInTheDocument();
  });

  it("renders an error message when page loading fails", () => {
    setupMocks();

    mocks.useReaderData.mockReturnValue({
      pages: [],
      chapters: [],

      pagesQuery: {
        isPending: false,
        isError: true,
        error: new Error("Failed to load pages"),
      },

      chaptersQuery: {
        hasNextPage: false,
        fetchNextPage: vi.fn(),
        isFetchingNextPage: false,
        isFetchNextPageError: false,
      },
    });

    renderReaderPage();

    expect(screen.getByText("Error: Failed to load pages")).toBeInTheDocument();
  });

  it("preloads pages using the current page", () => {
    setupMocks();

    renderReaderPage();

    expect(mocks.useReaderPreload).toHaveBeenCalledWith(pages, 0, 3);
  });

  it("configures long strip page tracking", () => {
    setupMocks();

    renderReaderPage();

    expect(mocks.useLongStripPageTracking).toHaveBeenCalledWith({
      enabled: true,
      onPageChange: expect.any(Function),
    });
  });

  it("configures long strip navigation with the current page", () => {
    setupMocks();

    renderReaderPage();

    expect(mocks.useLongStripNavigation).toHaveBeenCalledWith({
      currentPage: 0,
      totalPages: 3,
    });
  });

  it("renders an invalid URL message when mangaId is missing", () => {
    setupMocks();

    render(
      <MemoryRouter initialEntries={["/chapter/chapter-1"]}>
        <Routes>
          <Route path="/chapter/:chapterId" element={<ReaderPage />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText("Invalid Reader Url")).toBeInTheDocument();
  });

  it("restores the saved reading progress for the same manga and chapter",async()=>{
    localStorage.setItem(

      "manga-reader-progress",
      JSON.stringify([
        {
          mangaId:"manga-1",
          chapterId:"chapter-1",
          page:1,
          updatedAt:Date.now()
        }
      ])
    )

    renderReaderPage()
    expect(screen.getByText("Current Page : 2")).toBeInTheDocument()
  })

  it("does not restore progress from another chapter",()=>{
    localStorage.setItem("manga-reader-progress",JSON.stringify([{
      mangaId:"manga-1",
      chapterId:"chapter-999",
      page:1,
      updatedAt:Date.now()
    }]))

    renderReaderPage()

    expect(screen.getByText("Current Page : 1")).toBeInTheDocument()
  })

  it("does not restore preogress from another manga",()=>{
    localStorage.setItem(
      "manga-reader-progress",
      JSON.stringify([{
        mangaId:"manga-999",
        chapterId:"chapter-1",
        page:1,
        updatedAt:Date.now()
      }])
    )
    renderReaderPage()

    expect(screen.getByText("Current Page : 1"),).toBeInTheDocument()
  })

  it("waits until chapter pages are loaded before restoring progress", async()=>{
    localStorage.setItem("manga-reader-progress",JSON.stringify([{
      mangaId:"manga-1",
      chapterId:"chapter-1",
      page:1,
      updatedAt:Date.now()
    }]))

    mocks.useReaderData.mockReturnValue({
      pages:[],
      chapters:[],
      pagesQuery:{
        isPending:true,
        isError:false,
        error:null,
      },
      chapterQuery:{
        hasNextPage:false,
        fetchNextPage:vi.fn(),
        isFetchingNextPage:false,
        isFetchingNextPageError:false
      }
    })
    renderReaderPage()
    expect(screen.getByText("Loading pages ...")).toBeInTheDocument()
  })
});
