import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import type { ReactVirtualizer } from "@tanstack/react-virtual";

import LongStripReader from "../../components/LongStripReader/LongStripReader";

vi.mock("../../components/ReaderImage/ReaderImage", () => ({
  default: ({
    src,
    alt,
    shouldLoad,
  }: {
    src: string;
    alt: string;
    shouldLoad: boolean;
  }) => (
    <img
      src={src}
      alt={alt}
      data-should-load={String(shouldLoad)}
    />
  ),
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
  } as unknown as ReactVirtualizer<HTMLElement, Element>;
}

function createParentRef(): React.RefObject<HTMLElement | null> {
  return {
    current: null,
  };
}

describe("LongStripReader", () => {
  it("renders virtualized pages", () => {
    const pages = createPages(100);
    const virtualItems = createVirtualItems(5);
    const virtualizer = createMockVirtualizer(virtualItems);

    const parentRef = createParentRef();
    const onScrollContainerReady = vi.fn();

    render(
      <LongStripReader
        pages={pages}
        currentPage={0}
        renderAhead={2}
        parentRef={parentRef}
        virtualizer={virtualizer}
        onScrollContainerReady={onScrollContainerReady}
      />,
    );

    expect(screen.getByAltText("Page 1")).toBeInTheDocument();
    expect(screen.getByAltText("Page 2")).toBeInTheDocument();
    expect(screen.getByAltText("Page 3")).toBeInTheDocument();
    expect(screen.getByAltText("Page 4")).toBeInTheDocument();
    expect(screen.getByAltText("Page 5")).toBeInTheDocument();
  });

  it("does not render pages outside the virtualized range", () => {
    const pages = createPages(100);
    const virtualItems = createVirtualItems(5);
    const virtualizer = createMockVirtualizer(virtualItems);

    const parentRef = createParentRef();
    const onScrollContainerReady = vi.fn();

    render(
      <LongStripReader
        pages={pages}
        currentPage={0}
        renderAhead={2}
        parentRef={parentRef}
        virtualizer={virtualizer}
        onScrollContainerReady={onScrollContainerReady}
      />,
    );

    expect(screen.queryByAltText("Page 50")).not.toBeInTheDocument();
    expect(screen.queryByAltText("Page 100")).not.toBeInTheDocument();
  });

  it("renders fewer DOM pages than total pages", () => {
    const pages = createPages(100);
    const virtualItems = createVirtualItems(5);
    const virtualizer = createMockVirtualizer(virtualItems);

    const parentRef = createParentRef();
    const onScrollContainerReady = vi.fn();

    render(
      <LongStripReader
        pages={pages}
        currentPage={0}
        renderAhead={2}
        parentRef={parentRef}
        virtualizer={virtualizer}
        onScrollContainerReady={onScrollContainerReady}
      />,
    );

    const images = screen.getAllByRole("img");

    expect(images.length).toBe(5);
    expect(images.length).toBeLessThan(pages.length);
  });

  it("loads pages within renderAhead of currentPage", () => {
    const pages = createPages(10);
    const virtualItems = createVirtualItems(5);
    const virtualizer = createMockVirtualizer(virtualItems);

    const parentRef = createParentRef();
    const onScrollContainerReady = vi.fn();

    render(
      <LongStripReader
        pages={pages}
        currentPage={1}
        renderAhead={1}
        parentRef={parentRef}
        virtualizer={virtualizer}
        onScrollContainerReady={onScrollContainerReady}
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

    expect(screen.getByAltText("Page 5")).toHaveAttribute(
      "data-should-load",
      "false",
    );
  });

  it("does not load rendered pages outside renderAhead", () => {
    const pages = createPages(10);
    const virtualItems = createVirtualItems(5);
    const virtualizer = createMockVirtualizer(virtualItems);

    const parentRef = createParentRef();
    const onScrollContainerReady = vi.fn();

    render(
      <LongStripReader
        pages={pages}
        currentPage={0}
        renderAhead={1}
        parentRef={parentRef}
        virtualizer={virtualizer}
        onScrollContainerReady={onScrollContainerReady}
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

    expect(screen.getByAltText("Page 4")).toHaveAttribute(
      "data-should-load",
      "false",
    );
  });

  it("sets the correct data-page value", () => {
    const pages = createPages(10);
    const virtualItems = createVirtualItems(5);
    const virtualizer = createMockVirtualizer(virtualItems);

    const parentRef = createParentRef();
    const onScrollContainerReady = vi.fn();

    render(
      <LongStripReader
        pages={pages}
        currentPage={0}
        renderAhead={2}
        parentRef={parentRef}
        virtualizer={virtualizer}
        onScrollContainerReady={onScrollContainerReady}
      />,
    );

    const renderedImages = screen.getAllByRole("img");

    for (const image of renderedImages) {
      const pageWrapper = image.parentElement?.parentElement;

      expect(pageWrapper).toBeInTheDocument();

      const pageNumber = Number(
        image.getAttribute("alt")?.replace("Page ", ""),
      );

      expect(pageWrapper).toHaveAttribute(
        "data-page",
        String(pageNumber),
      );
    }
  });

  it("sets the correct data-index value", () => {
    const pages = createPages(10);
    const virtualItems = createVirtualItems(5);
    const virtualizer = createMockVirtualizer(virtualItems);

    const parentRef = createParentRef();
    const onScrollContainerReady = vi.fn();

    render(
      <LongStripReader
        pages={pages}
        currentPage={0}
        renderAhead={2}
        parentRef={parentRef}
        virtualizer={virtualizer}
        onScrollContainerReady={onScrollContainerReady}
      />,
    );

    const renderedImages = screen.getAllByRole("img");

    renderedImages.forEach((image, index) => {
      const pageWrapper = image.parentElement?.parentElement;

      expect(pageWrapper).toHaveAttribute(
        "data-index",
        String(index),
      );
    });
  });

  it("applies the virtual item start position", () => {
    const pages = createPages(10);
    const virtualItems = createVirtualItems(5, 800);
    const virtualizer = createMockVirtualizer(virtualItems);

    const parentRef = createParentRef();
    const onScrollContainerReady = vi.fn();

    render(
      <LongStripReader
        pages={pages}
        currentPage={0}
        renderAhead={2}
        parentRef={parentRef}
        virtualizer={virtualizer}
        onScrollContainerReady={onScrollContainerReady}
      />,
    );

    const renderedImages = screen.getAllByRole("img");

    renderedImages.forEach((image, index) => {
      const pageWrapper = image.parentElement?.parentElement;

      expect(pageWrapper).toHaveStyle(
        `transform: translateY(${index * 800}px)`,
      );
    });
  });

  it("uses the virtualizer total size for content height", () => {
    const pages = createPages(10);
    const virtualItems = createVirtualItems(5);
    const virtualizer = createMockVirtualizer(
      virtualItems,
      4000,
    );

    const parentRef = createParentRef();
    const onScrollContainerReady = vi.fn();

    render(
      <LongStripReader
        pages={pages}
        currentPage={0}
        renderAhead={2}
        parentRef={parentRef}
        virtualizer={virtualizer}
        onScrollContainerReady={onScrollContainerReady}
      />,
    );

    expect(virtualizer.getTotalSize).toHaveBeenCalled();

    const content = document.querySelector(
      ".reader-long-strip__content",
    );

    expect(content).toHaveStyle("height: 4000px");
  });

  it("calls measureElement for every mounted page", () => {
    const pages = createPages(10);
    const virtualItems = createVirtualItems(5);
    const virtualizer = createMockVirtualizer(virtualItems);

    const parentRef = createParentRef();
    const onScrollContainerReady = vi.fn();

    render(
      <LongStripReader
        pages={pages}
        currentPage={0}
        renderAhead={2}
        parentRef={parentRef}
        virtualizer={virtualizer}
        onScrollContainerReady={onScrollContainerReady}
      />,
    );

    expect(virtualizer.measureElement).toHaveBeenCalled();
    expect(virtualizer.measureElement).toHaveBeenCalledTimes(
      virtualItems.length,
    );
  });

  it("sets the parentRef when the container mounts", () => {
    const pages = createPages(10);
    const virtualItems = createVirtualItems(5);
    const virtualizer = createMockVirtualizer(virtualItems);

    const parentRef = createParentRef();
    const onScrollContainerReady = vi.fn();

    render(
      <LongStripReader
        pages={pages}
        currentPage={0}
        renderAhead={2}
        parentRef={parentRef}
        virtualizer={virtualizer}
        onScrollContainerReady={onScrollContainerReady}
      />,
    );

    expect(parentRef.current).toBeInstanceOf(HTMLElement);

    expect(parentRef.current).toHaveClass(
      "reader-long-strip",
    );
  });

  it("calls onScrollContainerReady with the container element", () => {
    const pages = createPages(10);
    const virtualItems = createVirtualItems(5);
    const virtualizer = createMockVirtualizer(virtualItems);

    const parentRef = createParentRef();
    const onScrollContainerReady = vi.fn();

    render(
      <LongStripReader
        pages={pages}
        currentPage={0}
        renderAhead={2}
        parentRef={parentRef}
        virtualizer={virtualizer}
        onScrollContainerReady={onScrollContainerReady}
      />,
    );

    expect(onScrollContainerReady).toHaveBeenCalledTimes(1);

    expect(onScrollContainerReady).toHaveBeenCalledWith(
      expect.any(HTMLElement),
    );

    expect(onScrollContainerReady).toHaveBeenCalledWith(
      parentRef.current,
    );
  });

  it("renders the correct accessibility label", () => {
    const pages = createPages(5);
    const virtualItems = createVirtualItems(3);
    const virtualizer = createMockVirtualizer(virtualItems);

    const parentRef = createParentRef();
    const onScrollContainerReady = vi.fn();

    render(
      <LongStripReader
        pages={pages}
        currentPage={0}
        renderAhead={2}
        parentRef={parentRef}
        virtualizer={virtualizer}
        onScrollContainerReady={onScrollContainerReady}
      />,
    );

    expect(
      screen.getByRole("region", {
        name: "Long strip reader",
      }),
    ).toBeInTheDocument();
  });

  it("does not render a page when the virtual index is invalid", () => {
    const pages = createPages(3);

    const virtualItems = [
      ...createVirtualItems(3),
      {
        index: 99,
        key: 99,
        start: 2400,
        end: 3200,
        size: 800,
        lane: 0,
      },
    ];

    const virtualizer = createMockVirtualizer(virtualItems);

    const parentRef = createParentRef();
    const onScrollContainerReady = vi.fn();

    render(
      <LongStripReader
        pages={pages}
        currentPage={0}
        renderAhead={1}
        parentRef={parentRef}
        virtualizer={virtualizer}
        onScrollContainerReady={onScrollContainerReady}
      />,
    );

    expect(screen.getAllByRole("img")).toHaveLength(3);

    expect(
      screen.queryByAltText("Page 100"),
    ).not.toBeInTheDocument();
  });
}); 

