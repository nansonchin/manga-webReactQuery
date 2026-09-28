import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { useLongStripVirtualizer } from "../../features/reader/hooks/useLongStripVirtualizer";

describe("useLongStripVirtualizer", () => {
  it("creates a virtualizer", () => {
    const { result } = renderHook(() =>
      useLongStripVirtualizer({
        count: 10,
      }),
    );

    expect(result.current.virtualizer).toBeDefined();
  });

  it("returns a parentRef", () => {
    const { result } = renderHook(() =>
      useLongStripVirtualizer({
        count: 10,
      }),
    );

    expect(result.current.parentRef).toBeDefined();
    expect(result.current.parentRef.current).toBeNull();
  });

  it("creates zero virtual items when count is zero", () => {
    const { result } = renderHook(() =>
      useLongStripVirtualizer({
        count: 0,
      }),
    );

    expect(
      result.current.virtualizer.getVirtualItems(),
    ).toEqual([]);
  });

  it("does not create more virtual items than the total count", () => {
    const { result } = renderHook(() =>
      useLongStripVirtualizer({
        count: 5,
      }),
    );

    const virtualItems =
      result.current.virtualizer.getVirtualItems();

    expect(virtualItems.length).toBeLessThanOrEqual(5);
  });

  it("returns an empty virtual range before a scroll element is attached", () => {
    const { result } = renderHook(() =>
      useLongStripVirtualizer({
        count: 100,
      }),
    );

    expect(
      result.current.virtualizer.getVirtualItems(),
    ).toEqual([]);
  });

  it("can request scrolling to a specific index", () => {
    const { result } = renderHook(() =>
      useLongStripVirtualizer({
        count: 100,
      }),
    );

    expect(() => {
      result.current.virtualizer.scrollToIndex(50);
    }).not.toThrow();
  });
});



