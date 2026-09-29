import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

import LongStripReader from "../../components/LongStripReader/LongStripReader";

import { useLongStripVirtualizer } from "../../hooks/useLongStripVirtualizer";

/**
 * Mock ReaderImage
 *
 * 我们在 LongStripReader test 中，
 * 不需要真的测试图片加载。
 *
 * ReaderImage 自己应该有另外的测试文件。
 */
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

/**
 * Mock LongStripVirtualizer
 *
 * 这里是整个测试最重要的部分。
 *
 * 我们不测试 TanStack Virtual 本身。
 * 我们假设 virtualizer 已经正确告诉 component：
 *
 * "现在需要渲染 page 0, 1, 2..."
 */
vi.mock("../../hooks/useLongStripVirtualizer", () => ({
  useLongStripVirtualizer: vi.fn(),
}));

type ReaderPageData = {
  index: number;
  url: string;
};

/**
 * 建立测试 pages
 */
function createPages(count: number): ReaderPageData[] {
  return Array.from({ length: count }, (_, index) => ({
    index,
    url: `page-${index + 1}.jpg`,
  }));
}

/**
 * 建立 fake virtual items
 *
 * 例如：
 *
 * page 0
 * page 1
 * page 2
 * page 3
 *
 * 每个 page 假设高度 800px。
 */
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

/**
 * 建立 fake virtualizer
 */
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

    /**
     * Virtualizer 只告诉 component：
     *
     * page 0 ~ page 4
     *
     * 所以 page 50 不应该出现在 DOM。
     */
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

    /**
     * currentPage = 1
     * renderAhead = 1
     *
     * 所以：
     *
     * page 0 -> true
     * page 1 -> true
     * page 2 -> true
     *
     * page 3 -> false
     */
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

    /**
     * currentPage = 0
     * renderAhead = 1
     *
     * targetPage = 3
     *
     * page 4 虽然距离 currentPage 很远，
     * 但是因为是 targetPage，
     * 所以 shouldLoad 必须是 true。
     */
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

      /**
       * Mock ReaderImage：
       *
       * <div data-page="1">
       *   <img />
       * </div>
       *
       * 所以 img.parentElement 就是 page wrapper。
       */
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
