import { act, renderHook } from "@testing-library/react";
import { useLongStripNavigation } from "../../features/reader/hooks/useLongStripNavigation";
import { describe, expect, it } from "vitest";

describe("useLongStripNavigation", () => {
  it("sets targetPage when requesting a valid page", () => {
    const { result } = renderHook(() =>
      useLongStripNavigation({ currentPage: 2, totalPages: 10 }),
    );

    act(() => {
      result.current.requestScrollToPage(5);
    });

    expect(result.current.targetPage).toBe(5);
  });

  it("does not set targetPage when totalPages is 0", () => {
    const { result } = renderHook(() =>
      useLongStripNavigation({
        currentPage: 0,
        totalPages: 0,
      }),
    );
    act(() => {
      result.current.requestScrollToPage(3);
    });

    expect(result.current.targetPage).toBeNull()
  });

  it("clamps a page tahat is greater than the last page",()=>{
    const {result}= renderHook(()=>useLongStripNavigation({
        currentPage:0,
        totalPages:5
    }))

    act(()=>{
        result.current.requestScrollToPage(10)
    })

    expect(result.current.targetPage).toBe(4)
  })

  it("clamps a negative page to 0",()=>{
    const {result} =  renderHook(()=>useLongStripNavigation({currentPage:2,totalPages:5}))
    
    act(()=>{
        result.current.requestScrollToPage(-1)
    })

    expect(result.current.targetPage).toBe(0)
})
});
