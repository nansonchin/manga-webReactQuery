import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

import LongStripReader from "../../components/LongStripReader/LongStripReader";

import { useLongStripVirtualizer } from "../../hooks/useLongStripVirtualizer";


vi.mock("../../components/ReaderImage/ReaderImage", () => ({
  default: ({
    src,
    alt,
    shouldLoad,
  }: {
    src: string;
    alt: string;
    shouldLoad: boolean;
  }) => <img src={src} alt={alt} data-should-load={String(shouldLoad)} />,
}));

vi.mock("../../hooks/useLongStripVirtualizer", () => ({
  useLongStripVirtualizer: vi.fn(),
}));

type ReaderPageData = {
  index: number;
  url: string;
};

function createPages(count: number): ReaderPageData[] {
  return Array.from({ length: count }, (_, index) => ({
    index,
    url: `page-${index + 1}.jpg`,
  }));
}

function createVirtualItems(count: number, size = 800) {
  return Array.from({ length: count }, (_, index) => ({
    index,
    key: index,
    start: index * size,
    end: (index + 1) * size,
    size,
    lane: 0,
  }));
}

function createMockVirtualizer(
  virtualItems: ReturnType<typeof createVirtualItems>,
  totalSize = virtualItems.length * 800,
) {
  return {
    getVirtualItems: vi.fn(() => virtualItems),

    getTotalSize: vi.fn(() => totalSize),

    measureElement: vi.fn(),

    scrollToIndex: vi.fn(),

    scrollToOffset: vi.fn(),
  };
}

describe("LongStripReader", () => {
  it("renders virtualized pages", () => {
    const pages = createPages(100);

    const virtualItems = createVirtualItems(5);

    const mockVirtualizer = createMockVirtualizer(virtualItems);

    vi.mocked(useLongStripVirtualizer).mockReturnValue({
      parentRef: { current: null },
      virtualizer: mockVirtualizer as any,
    });

    const observePage = vi.fn();

    render(
      <LongStripReader
        pages={pages}
        currentPage={0}
        renderAhead={2}
        targetPage={null}
        observePage={observePage}
      />,
    );

    expect(screen.getByAltText("Page 1")).toBeInTheDocument();

    expect(screen.getByAltText("Page 2")).toBeInTheDocument();

    expect(screen.getByAltText("Page 5")).toBeInTheDocument();
  });

  it("does not render pages outside the virtualized range", () => {
    const pages = createPages(100);

    const virtualItems = createVirtualItems(5);

    const mockVirtualizer = createMockVirtualizer(virtualItems);

    vi.mocked(useLongStripVirtualizer).mockReturnValue({
      parentRef: { current: null },
      virtualizer: mockVirtualizer as any,
    });

    const observePage = vi.fn();

    render(
      <LongStripReader
        pages={pages}
        currentPage={0}
        renderAhead={2}
        targetPage={null}
        observePage={observePage}
      />,
    );

    expect(screen.queryByAltText("Page 50")).not.toBeInTheDocument();
  });

  it("renders fewer DOM pages than total pages", () => {
    const pages = createPages(100);

    const virtualItems = createVirtualItems(5);

    const mockVirtualizer = createMockVirtualizer(virtualItems);

    vi.mocked(useLongStripVirtualizer).mockReturnValue({
      parentRef: { current: null },
      virtualizer: mockVirtualizer as any,
    });

    const observePage = vi.fn();

    render(
      <LongStripReader
        pages={pages}
        currentPage={0}
        renderAhead={2}
        targetPage={null}
        observePage={observePage}
      />,
    );

    const images = screen.getAllByRole("img");

    expect(images.length).toBeLessThan(pages.length);
  });

  it("loads pages near currentPage", () => {
    const pages = createPages(10);

    const virtualItems = createVirtualItems(4);

    const mockVirtualizer = createMockVirtualizer(virtualItems);

    vi.mocked(useLongStripVirtualizer).mockReturnValue({
      parentRef: { current: null },
      virtualizer: mockVirtualizer as any,
    });

    const observePage = vi.fn();

    render(
      <LongStripReader
        pages={pages}
        currentPage={1}
        renderAhead={1}
        targetPage={null}
        observePage={observePage}
      />,
    );

    expect(screen.getByAltText("Page 1")).toHaveAttribute(
      "data-should-load",
      "true",
    );

    expect(screen.getByAltText("Page 2")).toHaveAttribute(
      "data-should-load",
      "true",
    );

    expect(screen.getByAltText("Page 3")).toHaveAttribute(
      "data-should-load",
      "true",
    );

    expect(screen.getByAltText("Page 4")).toHaveAttribute(
      "data-should-load",
      "false",
    );
  });

  it("does not load rendered page outside renderAhead", () => {
    const pages = createPages(10);

    const virtualItems = createVirtualItems(5);

    const mockVirtualizer = createMockVirtualizer(virtualItems);

    vi.mocked(useLongStripVirtualizer).mockReturnValue({
      parentRef: { current: null },
      virtualizer: mockVirtualizer as any,
    });

    const observePage = vi.fn();

    render(
      <LongStripReader
        pages={pages}
        currentPage={0}
        renderAhead={1}
        targetPage={null}
        observePage={observePage}
      />,
    );

    expect(screen.getByAltText("Page 1")).toHaveAttribute(
      "data-should-load",
      "true",
    );

    expect(screen.getByAltText("Page 2")).toHaveAttribute(
      "data-should-load",
      "true",
    );

    expect(screen.getByAltText("Page 3")).toHaveAttribute(
      "data-should-load",
      "false",
    );
  });

  it("loads targetPage even when it is outside renderAhead", () => {
    const pages = createPages(10);

    const virtualItems = createVirtualItems(5);

    const mockVirtualizer = createMockVirtualizer(virtualItems);

    vi.mocked(useLongStripVirtualizer).mockReturnValue({
      parentRef: { current: null },
      virtualizer: mockVirtualizer as any,
    });

    const observePage = vi.fn();

    render(
      <LongStripReader
        pages={pages}
        currentPage={0}
        renderAhead={1}
        targetPage={3}
        observePage={observePage}
      />,
    );

    const targetPage = screen.getByAltText("Page 4");

    expect(targetPage).toHaveAttribute("data-should-load", "true");
  });

  it("calls observePage for mounted page elements", () => {
    const pages = createPages(100);

    const virtualItems = createVirtualItems(5);

    const mockVirtualizer = createMockVirtualizer(virtualItems);

    vi.mocked(useLongStripVirtualizer).mockReturnValue({
      parentRef: { current: null },
      virtualizer: mockVirtualizer as any,
    });

    const observePage = vi.fn();

    render(
      <LongStripReader
        pages={pages}
        currentPage={0}
        renderAhead={2}
        targetPage={null}
        observePage={observePage}
      />,
    );

    expect(observePage).toHaveBeenCalled();

    expect(observePage.mock.calls.length).toBeLessThan(pages.length);

    for (const [element] of observePage.mock.calls) {
      expect(element).toBeInstanceOf(HTMLDivElement);

      expect(element.dataset.page).toBeDefined();
    }
  });

  it("sets the correct data-page value", () => {
    const pages = createPages(10);

    const virtualItems = createVirtualItems(5);

    const mockVirtualizer = createMockVirtualizer(virtualItems);

    vi.mocked(useLongStripVirtualizer).mockReturnValue({
      parentRef: { current: null },
      virtualizer: mockVirtualizer as any,
    });

    const observePage = vi.fn();

    render(
      <LongStripReader
        pages={pages}
        currentPage={0}
        renderAhead={2}
        targetPage={null}
        observePage={observePage}
      />,
    );

    const renderedImages = screen.getAllByRole("img");

    for (const image of renderedImages) {
      const pageWrapper = image.parentElement;

      expect(pageWrapper).toBeInTheDocument();

      const pageNumber = Number(
        image.getAttribute("alt")?.replace("Page ", ""),
      );

      expect(pageWrapper).toHaveAttribute("data-page", String(pageNumber));
    }
  });

  it("calls measureElement for mounted pages", () => {
    const pages = createPages(10);

    const virtualItems = createVirtualItems(5);

    const mockVirtualizer = createMockVirtualizer(virtualItems);

    vi.mocked(useLongStripVirtualizer).mockReturnValue({
      parentRef: { current: null },
      virtualizer: mockVirtualizer as any,
    });

    const observePage = vi.fn();

    render(
      <LongStripReader
        pages={pages}
        currentPage={0}
        renderAhead={2}
        targetPage={null}
        observePage={observePage}
      />,
    );

    expect(mockVirtualizer.measureElement).toHaveBeenCalled();

    expect(mockVirtualizer.measureElement).toHaveBeenCalledTimes(
      virtualItems.length,
    );
  });
});
