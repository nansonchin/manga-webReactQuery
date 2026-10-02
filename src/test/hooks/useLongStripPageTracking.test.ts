import { act, renderHook } from "@testing-library/react";

import { beforeEach, describe, expect, it, vi } from "vitest";

import { useLongStripPageTracking } from "../../features/reader/hooks/useLongStripPageTracking";
import type { ReactVirtualizer } from "@tanstack/react-virtual";

type VirtualItem = {
  index: number;
  start: number;
  end: number;
  size: number;
};

describe("useLongStripPageTracking", () => {
  let root: HTMLElement;

  let virtualItems: VirtualItem[];

  let getVirtualItemsMock: ReturnType<typeof vi.fn>;

  let requestAnimationFrameMock: ReturnType<typeof vi.fn>;

  let cancelAnimationFrameMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();

    root = document.createElement("div");

    Object.defineProperty(root, "scrollTop", {
      configurable: true,
      writable: true,
      value: 0,
    });

    Object.defineProperty(root, "clientHeight", {
      configurable: true,
      value: 1000,
    });

    virtualItems = [];

    getVirtualItemsMock = vi.fn(() => virtualItems);

    /**
     * -------------------------------------------------------
     * Fake requestAnimationFrame
     * -------------------------------------------------------
     *
     * 不让 RAF 真正异步，
     * test 可以直接控制 callback。
     */
    requestAnimationFrameMock = vi.fn((callback: FrameRequestCallback) => {
      callback(0);

      return 1;
    });

    cancelAnimationFrameMock = vi.fn();

    vi.stubGlobal("requestAnimationFrame", requestAnimationFrameMock);

    vi.stubGlobal("cancelAnimationFrame", cancelAnimationFrameMock);
  });

  function renderTracking(options?: { enabled?: boolean }) {
    const onPageChange = vi.fn();

    const enabled = options?.enabled ?? true;

    const virtualizer = {
      getVirtualItems: getVirtualItemsMock,

      getTotalSize: vi.fn(),
      scrollToIndex: vi.fn(),
      scrollToOffset: vi.fn(),
      measureElement: vi.fn(),
    };

    const hook = renderHook(() =>
      useLongStripPageTracking({
        enabled,
        root,
        virtualizer: virtualizer as never,
        onPageChange,
      }),
    );

    return {
      ...hook,
      onPageChange,
      virtualizer,
    };
  }

  it("updates current page based on the viewport center", () => {
    virtualItems = [
      {
        index: 0,
        start: 0,
        end: 400,
        size: 400,
      },

      {
        index: 1,
        start: 400,
        end: 800,
        size: 400,
      },

      {
        index: 2,
        start: 800,
        end: 1200,
        size: 400,
      },
    ];

    const { onPageChange } = renderTracking();

    expect(onPageChange).toHaveBeenCalledWith(1);
  });

  it("updates current page when scroll position changes", () => {
    virtualItems = [
      {
        index: 0,
        start: 0,
        end: 500,
        size: 500,
      },

      {
        index: 1,
        start: 500,
        end: 1000,
        size: 500,
      },

      {
        index: 2,
        start: 1000,
        end: 1500,
        size: 500,
      },
    ];

    const { onPageChange } = renderTracking();

    expect(onPageChange).toHaveBeenCalledWith(1);

    onPageChange.mockClear();

    root.scrollTop = 700;

    act(() => {
      root.dispatchEvent(new Event("scroll"));
    });

    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it("selects the page containing the viewport center", () => {
    virtualItems = [
      {
        index: 0,
        start: 0,
        end: 300,
        size: 300,
      },

      {
        index: 1,
        start: 300,
        end: 900,
        size: 600,
      },

      {
        index: 2,
        start: 900,
        end: 1400,
        size: 500,
      },
    ];

    const { onPageChange } = renderTracking();

    expect(onPageChange).toHaveBeenCalledWith(1);
  });

  /**
   * ---------------------------------------------------------
   * Closest page
   * ---------------------------------------------------------
   */
  it("selects the closest page when viewport center is between pages", () => {
    virtualItems = [
      {
        index: 0,
        start: 0,
        end: 300,
        size: 300,
      },

      {
        index: 1,
        start: 500,
        end: 700,
        size: 200,
      },

      {
        index: 2,
        start: 900,
        end: 1200,
        size: 300,
      },
    ];

    const { onPageChange } = renderTracking();

    expect(onPageChange).toHaveBeenCalledWith(1);
  });

  it("resumes tracking after programmatic navigation ends", () => {
    const onPageChange = vi.fn();

    const root = document.createElement("div");

    Object.defineProperty(root, "clientHeight", {
      configurable: true,
      value: 1000,
    });

    Object.defineProperty(root, "scrollTop", {
      configurable: true,
      writable: true,
      value: 0,
    });

    const virtualizer = {
      getVirtualItems: vi.fn(() => [
        {
          index: 0,
          start: 0,
          end: 500,
          size: 500,
        },
        {
          index: 1,
          start: 500,
          end: 1000,
          size: 500,
        },
        {
          index: 2,
          start: 1000,
          end: 1500,
          size: 500,
        },
      ]),
    } as unknown as ReactVirtualizer<HTMLElement, Element>;

    const { result } = renderHook(() =>
      useLongStripPageTracking({
        enabled: true,
        root,
        virtualizer,
        onPageChange,
      }),
    );

    act(() => {
      root.dispatchEvent(new Event("scroll"));
    });

    expect(onPageChange).toHaveBeenCalled();

    onPageChange.mockClear();

    act(() => {
      result.current.setProgrammaticNavigation(true);
    });

    root.scrollTop = 1000;

    act(() => {
      root.dispatchEvent(new Event("scroll"));
    });

    expect(onPageChange).not.toHaveBeenCalled();

    act(() => {
      result.current.setProgrammaticNavigation(false);
    });

    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it("does not track when disabled", () => {
    virtualItems = [
      {
        index: 0,
        start: 0,
        end: 1000,
        size: 1000,
      },
    ];

    const { onPageChange } = renderTracking({
      enabled: false,
    });

    expect(onPageChange).not.toHaveBeenCalled();

    act(() => {
      root.dispatchEvent(new Event("scroll"));
    });

    expect(onPageChange).not.toHaveBeenCalled();
  });

  it("does not update when there are no virtual items", () => {
    virtualItems = [];

    const { onPageChange } = renderTracking();

    expect(onPageChange).not.toHaveBeenCalled();
  });

  it("does not update when root is null", () => {
    virtualItems = [
      {
        index: 0,
        start: 0,
        end: 1000,
        size: 1000,
      },
    ];

    const onPageChange = vi.fn();

    const virtualizer = {
      getVirtualItems: getVirtualItemsMock,

      getTotalSize: vi.fn(),
      scrollToIndex: vi.fn(),
      scrollToOffset: vi.fn(),
      measureElement: vi.fn(),
    };

    renderHook(() =>
      useLongStripPageTracking({
        enabled: true,
        root: null,
        virtualizer: virtualizer as never,
        onPageChange,
      }),
    );

    expect(onPageChange).not.toHaveBeenCalled();
  });

  it("does not update current page during programmatic navigation", () => {
    virtualItems = [
      {
        index: 0,
        start: 0,
        end: 500,
        size: 500,
      },

      {
        index: 1,
        start: 500,
        end: 1000,
        size: 500,
      },

      {
        index: 2,
        start: 1000,
        end: 1500,
        size: 500,
      },
    ];

    const { result, onPageChange } = renderTracking();

    expect(onPageChange).toHaveBeenCalledWith(1);

    onPageChange.mockClear();

    /**
     * 开始 programmatic navigation。
     */
    act(() => {
      result.current.setProgrammaticNavigation(true);
    });

    root.scrollTop = 700;

    act(() => {
      root.dispatchEvent(new Event("scroll"));
    });

    /**
     * tracking 应该被 lock。
     */
    expect(onPageChange).not.toHaveBeenCalled();
  });

  /**
   * ---------------------------------------------------------
   * Resume tracking
   * ---------------------------------------------------------
   */
  it("resumes tracking after programmatic navigation ends", () => {
    virtualItems = [
      {
        index: 0,
        start: 0,
        end: 500,
        size: 500,
      },

      {
        index: 1,
        start: 500,
        end: 1000,
        size: 500,
      },

      {
        index: 2,
        start: 1000,
        end: 1500,
        size: 500,
      },
    ];

    const { result, onPageChange } = renderTracking();

    onPageChange.mockClear();

    act(() => {
      result.current.setProgrammaticNavigation(true);
    });

    root.scrollTop = 700;

    act(() => {
      root.dispatchEvent(new Event("scroll"));
    });

    expect(onPageChange).not.toHaveBeenCalled();

    act(() => {
      result.current.setProgrammaticNavigation(false);
    });

    act(() => {
      root.dispatchEvent(new Event("scroll"));
    });

    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  /**
   * ---------------------------------------------------------
   * Cleanup
   * ---------------------------------------------------------
   */
  it("removes the scroll listener when unmounted", () => {
    virtualItems = [
      {
        index: 0,
        start: 0,
        end: 1000,
        size: 1000,
      },
    ];

    const { unmount } = renderTracking();

    const removeSpy = vi.spyOn(root, "removeEventListener");

    unmount();

    expect(removeSpy).toHaveBeenCalledWith("scroll", expect.any(Function));
  });
});
