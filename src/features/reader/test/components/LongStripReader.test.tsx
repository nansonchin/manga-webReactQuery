import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  should,
  vi,
} from "vitest";
import LongStripReader from "../../components/LongStripReader/LongStripReader";
import { render, screen } from "@testing-library/react";

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

function mockLayout() {
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(
    function () {
      if (this.classList.contains("reader-long-strip")) {
        return {
          width: 800,
          height: 800,
          top: 0,
          left: 0,
          right: 800,
          bottom: 800,
          x: 0,
          y: 0,
          toJSON: () => {},
        };
      }
      return {
        width: 800,
        height: 800,
        top: 0,
        left: 0,
        right: 800,
        bottom: 800,
        x: 0,
        y: 0,
        toJSON: () => {},
      };
    },
  );
  Object.defineProperty(HTMLElement.prototype, "clientHeight", {
    configurable: true,
    value: 800,
  });
  Object.defineProperty(HTMLElement.prototype, "clientWidth", {
    configurable: true,
    value: 800,
  });
  Object.defineProperty(HTMLElement.prototype, "scrollHeight", {
    configurable: true,
    value: 80000,
  });
  Object.defineProperty(HTMLElement.prototype, "scrollWidth", {
    configurable: true,
    value: 800,
  });
}

describe("Long StripReader", () => {
  beforeEach(() => {
    mockLayout();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("reders the first page", () => {
    const pages = createPages(100);
    const oberservePage = vi.fn();

    render(
      <LongStripReader
        pages={pages}
        currentPage={0}
        renderAhead={2}
        targetPage={null}
        observePage={oberservePage}
      />,
    );
    expect(screen.getByAltText("Page 1")).toBeInTheDocument();
  });

  it("does not render every page into the DOM", () => {
    const pages = createPages(100);
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

  it("does not initially render a far-away page", () => {
    const pages = createPages(100);
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
    expect(screen.getByAltText("Page 50")).not.toBeInTheDocument();
  });

  it("loads pages near the current page", () => {
    const pages = createPages(10);
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
    const page1 = screen.getAllByAltText("Page 1");
    const page2 = screen.getAllByAltText("Page 2");
    const page3 = screen.getAllByAltText("Page 3");

    expect(page1).toHaveAttribute("data-should-load", "true");
    expect(page2).toHaveAttribute("data-should-load", "true");
    expect(page3).toHaveAttribute("data-should-load", "true");
  });

  it("does no load a rendered page outside renderAhead", () => {
    const pages = createPages(10);
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

    const page3 = screen.queryByAltText("Page 3");

    if (page3) {
      expect(page3).toHaveAttribute("data-should-load", "false");
    }
  });

  it("loads  targetPage when targetPage is rendered", () => {
    const pages = createPages(10);
    const observePage = vi.fn();
    render(
      <LongStripReader
        pages={pages}
        currentPage={1}
        renderAhead={1}
        targetPage={3}
        observePage={observePage}
      />,
    );
    const targetPage = screen.queryAllByAltText("Page 4");

    if (targetPage) {
      expect(targetPage).toHaveAttribute("data-should-load", "true");
    }
  });

  it("passes mounted page elements to observePage", () => {
    const pages = createPages(100);
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
  it("sets the correct data-page value",()=>{
    const pages = createPages(10)
    const observePage= vi.fn()
    render(<LongStripReader pages={pages} currentPage={0} renderAhead={2} targetPage={null} observePage={observePage}/>)
    
    const renderedImages=screen.getAllByRole("img")

    for(const image of renderedImages){
        const pageWrapper = image.parentElement?.parentElement
        expect(pageWrapper).toBeInTheDocument();

        const pageNumber=Number(image.getAttribute("alt")?.replace("Page",""))

        expect(pageWrapper).toHaveAttribute("data-page",String(pageNumber))
    }
})
});
