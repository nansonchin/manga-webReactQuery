import {
  act,
  renderHook,
} from "@testing-library/react";

import {
  describe,
  expect,
  it,
  vi,
} from "vitest";

import { useLongStripNavigation } from "../../features/reader/hooks/useLongStripNavigation";


function createVirtualizer() {
  return {
    scrollToIndex: vi.fn(),
  };
}


describe("useLongStripNavigation", () => {
  it("scrolls to a valid page with the virtualizer", () => {
    const virtualizer = createVirtualizer();

    const onPageChange = vi.fn();

    const {
      result,
    } = renderHook(() =>
      useLongStripNavigation({
        currentPage: 2,
        totalPages: 10,
        virtualizer: virtualizer as never,
        onPageChange,
      }),
    );

    act(() => {
      result.current.requestScrollToPage(5);
    });

    expect(
      virtualizer.scrollToIndex,
    ).toHaveBeenCalledWith(
      5,
      {
        align: "start",
        behavior: "auto",
      },
    );

    expect(
      onPageChange,
    ).toHaveBeenCalledWith(5);
  });


  it("does not navigate when totalPages is 0", () => {
    const virtualizer = createVirtualizer();

    const onPageChange = vi.fn();

    const {
      result,
    } = renderHook(() =>
      useLongStripNavigation({
        currentPage: 0,
        totalPages: 0,
        virtualizer: virtualizer as never,
        onPageChange,
      }),
    );

    act(() => {
      result.current.requestScrollToPage(3);
    });

    expect(
      virtualizer.scrollToIndex,
    ).not.toHaveBeenCalled();

    expect(
      onPageChange,
    ).not.toHaveBeenCalled();

    expect(
      result.current.targetPage,
    ).toBeNull();
  });


  it("clamps a page greater than the last page", () => {
    const virtualizer = createVirtualizer();

    const onPageChange = vi.fn();

    const {
      result,
    } = renderHook(() =>
      useLongStripNavigation({
        currentPage: 0,
        totalPages: 5,
        virtualizer: virtualizer as never,
        onPageChange,
      }),
    );

    act(() => {
      result.current.requestScrollToPage(10);
    });

    expect(
      virtualizer.scrollToIndex,
    ).toHaveBeenCalledWith(
      4,
      {
        align: "start",
        behavior: "auto",
      },
    );

    expect(
      onPageChange,
    ).toHaveBeenCalledWith(4);
  });


  it("clamps a negative page to 0", () => {
    const virtualizer = createVirtualizer();

    const onPageChange = vi.fn();

    const {
      result,
    } = renderHook(() =>
      useLongStripNavigation({
        currentPage: 2,
        totalPages: 5,
        virtualizer: virtualizer as never,
        onPageChange,
      }),
    );

    act(() => {
      result.current.requestScrollToPage(-1);
    });

    expect(
      virtualizer.scrollToIndex,
    ).toHaveBeenCalledWith(
      0,
      {
        align: "start",
        behavior: "auto",
      },
    );

    expect(
      onPageChange,
    ).toHaveBeenCalledWith(0);
  });


  it("does not navigate when requesting the current page", () => {
    const virtualizer = createVirtualizer();

    const onPageChange = vi.fn();

    const {
      result,
    } = renderHook(() =>
      useLongStripNavigation({
        currentPage: 2,
        totalPages: 10,
        virtualizer: virtualizer as never,
        onPageChange,
      }),
    );

    act(() => {
      result.current.requestScrollToPage(2);
    });

    expect(
      virtualizer.scrollToIndex,
    ).not.toHaveBeenCalled();

    expect(
      onPageChange,
    ).not.toHaveBeenCalled();

    expect(
      result.current.targetPage,
    ).toBeNull();
  });


  it("scrolls to the next page", () => {
    const virtualizer = createVirtualizer();

    const onPageChange = vi.fn();

    const {
      result,
    } = renderHook(() =>
      useLongStripNavigation({
        currentPage: 2,
        totalPages: 10,
        virtualizer: virtualizer as never,
        onPageChange,
      }),
    );

    act(() => {
      result.current.scrollToNextPage();
    });

    expect(
      virtualizer.scrollToIndex,
    ).toHaveBeenCalledWith(
      3,
      {
        align: "start",
        behavior: "auto",
      },
    );

    expect(
      onPageChange,
    ).toHaveBeenCalledWith(3);
  });


  it("scrolls to the previous page", () => {
    const virtualizer = createVirtualizer();

    const onPageChange = vi.fn();

    const {
      result,
    } = renderHook(() =>
      useLongStripNavigation({
        currentPage: 2,
        totalPages: 10,
        virtualizer: virtualizer as never,
        onPageChange,
      }),
    );

    act(() => {
      result.current.scrollToPreviousPage();
    });

    expect(
      virtualizer.scrollToIndex,
    ).toHaveBeenCalledWith(
      1,
      {
        align: "start",
        behavior: "auto",
      },
    );

    expect(
      onPageChange,
    ).toHaveBeenCalledWith(1);
  });


  it("does not go beyond the last page", () => {
    const virtualizer = createVirtualizer();

    const onPageChange = vi.fn();

    const {
      result,
    } = renderHook(() =>
      useLongStripNavigation({
        currentPage: 4,
        totalPages: 5,
        virtualizer: virtualizer as never,
        onPageChange,
      }),
    );

    act(() => {
      result.current.scrollToNextPage();
    });

    expect(
      virtualizer.scrollToIndex,
    ).not.toHaveBeenCalled();

    expect(
      onPageChange,
    ).not.toHaveBeenCalled();
  });


  it("does not go before the first page", () => {
    const virtualizer = createVirtualizer();

    const onPageChange = vi.fn();

    const {
      result,
    } = renderHook(() =>
      useLongStripNavigation({
        currentPage: 0,
        totalPages: 5,
        virtualizer: virtualizer as never,
        onPageChange,
      }),
    );

    act(() => {
      result.current.scrollToPreviousPage();
    });

    expect(
      virtualizer.scrollToIndex,
    ).not.toHaveBeenCalled();

    expect(
      onPageChange,
    ).not.toHaveBeenCalled();
  });


  it("locks tracking during programmatic navigation", () => {
    const virtualizer = createVirtualizer();

    const onPageChange = vi.fn();

    const setProgrammaticNavigation =
      vi.fn();

    const {
      result,
    } = renderHook(() =>
      useLongStripNavigation({
        currentPage: 2,
        totalPages: 10,
        virtualizer: virtualizer as never,
        onPageChange,
        setProgrammaticNavigation,
      }),
    );

    act(() => {
      result.current.requestScrollToPage(5);
    });

    expect(
      setProgrammaticNavigation,
    ).toHaveBeenCalledWith(true);
  });
}); 

