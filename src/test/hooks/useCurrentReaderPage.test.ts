import { describe, expect, it } from "vitest";
import { useCurrentReaderPage } from "../../features/reader/hooks/useCurrentReaderPage";
import { act, render, renderHook } from "@testing-library/react";

describe("useCurrentReaderPage", () => {
  it("starts at the first page", () => {
    const { result } = renderHook(() =>
      useCurrentReaderPage({ totalPages: 5 }),
    );

    expect(result.current.currentPage).toBe(0);
  });

  it("moves to the next page", () => {
    const { result } = renderHook(() =>
      useCurrentReaderPage({ totalPages: 5 }),
    );

    act(() => {
      result.current.goToNextPage();
    });

    expect(result.current.currentPage).toBe(1);

    act(() => {
      result.current.goToNextPage();
    });

    expect(result.current.currentPage).toBe(2);
  });

  it("moves to the  previous page", () => {
    const { result } = renderHook(() =>
      useCurrentReaderPage({ totalPages: 5 }),
    );

    act(() => {
      result.current.goToNextPage();
    });

    act(() => {
      result.current.goToNextPage();
    });

    expect(result.current.currentPage).toBe(2);
    act(() => {
      result.current.goToPreviousPage();
    });

    expect(result.current.currentPage).toBe(1);
  });

  it("does not move before the first page", () => {
    const { result } = renderHook(() =>
      useCurrentReaderPage({ totalPages: 5 }),
    );

    expect(result.current.currentPage).toBe(0);

    act(() => {
      result.current.goToPreviousPage();
    });

    expect(result.current.currentPage).toBe(0);
  });

  it("does not move past the last page", () => {
    const { result } = renderHook(() =>
      useCurrentReaderPage({ totalPages: 3 }),
    );

    act(() => {
      result.current.goToNextPage();
    });
    act(() => {
      result.current.goToNextPage();
    });

    expect(result.current.currentPage).toBe(2);

    act(() => {
      result.current.goToNextPage();
    });

    expect(result.current.currentPage).toBe(2);
  });

  it("ignores an  invalid page passed to goToPage", () => {
    const { result } = renderHook(() =>
      useCurrentReaderPage({ totalPages: 5 }),
    );

    expect(result.current.currentPage).toBe(0);

    act(() => {
      result.current.goToPage(-1);
    });
    expect(result.current.currentPage).toBe(0);
    act(() => {
      result.current.goToPage(5);
    });
    expect(result.current.currentPage).toBe(0);

    act(() => {
      result.current.goToPage(1.5);
    });
    expect(result.current.currentPage).toBe(0);
  });

  it("updates the current page ffrom valid tracking information", () => {
    const { result } = renderHook(() =>
      useCurrentReaderPage({ totalPages: 5 }),
    );

    act(() => {
      {
        result.current.setCurrentPageFromTracking(3);
      }
    });

    expect(result.current.currentPage).toBe(3);
  });

  it("ignores invalid tracking infomation", () => {
    const { result } = renderHook(() =>
      useCurrentReaderPage({ totalPages: 5 }),
    );

    expect(result.current.currentPage).toBe(0);
    act(() => {
      result.current.setCurrentPageFromTracking(5);
    });

    expect(result.current.currentPage).toBe(0);

    act(() => {
      result.current.setCurrentPageFromTracking(1.5);
    });
    expect(result.current.currentPage).toBe(0);
  });

  it("clamps the current page when totalPages becomes smaller", () => {
    const { result, rerender } = renderHook(
      ({ totalPages }) => useCurrentReaderPage({ totalPages }),
      {
        initialProps: {
          totalPages: 10,
        },
      },
    );

    act(() => {
      result.current.goToPage(8);
    });

    expect(result.current.currentPage).toBe(8);

    rerender({
      totalPages: 5,
    });

    expect(result.current.currentPage).toBe(4);
  });

  it("resets the current page to 0 when totalPages becomes 0", () => {
    const { result, rerender } = renderHook(
      ({ totalPages }) => useCurrentReaderPage({ totalPages }),
      { initialProps: { totalPages: 5 } },
    );

    act(() => {
      result.current.goToPage(3);
    });

    expect(result.current.goToPage(3));

    rerender({ totalPages: 0 });

    expect(result.current.currentPage).toBe(0);
  });
});
