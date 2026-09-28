import { act, renderHook, waitFor } from "@testing-library/react";
import { useLongStripNavigation } from "../../features/reader/hooks/useLongStripNavigation";
import { describe, expect, it, vi } from "vitest";

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

    expect(result.current.targetPage).toBeNull();
  });

  it("clamps a page tahat is greater than the last page", () => {
    const { result } = renderHook(() =>
      useLongStripNavigation({
        currentPage: 0,
        totalPages: 5,
      }),
    );

    act(() => {
      result.current.requestScrollToPage(10);
    });

    expect(result.current.targetPage).toBe(4);
  });

  it("clamps a negative page to 0", () => {
    const { result } = renderHook(() =>
      useLongStripNavigation({ currentPage: 2, totalPages: 5 }),
    );

    act(() => {
      result.current.requestScrollToPage(-1);
    });

    expect(result.current.targetPage).toBe(0);
  });

  it("scrolls to the target page when the DOm element exists ", async()=>{
    const scrollIntoView = vi.fn()

    const element = document.createElement("div")

    element.setAttribute("data-page","6")
    element.scrollIntoView=scrollIntoView

    document.body.appendChild(element)

    const {result} = renderHook(()=> useLongStripNavigation({currentPage:2,totalPages:10}))

    act(()=>{
      result.current.requestScrollToPage(5)
    })

    await waitFor(()=>{
      expect(scrollIntoView).toHaveBeenCalledWith({behavior:"auto",block:"start"})
    })

    expect(result.current.targetPage).toBeNull
    element.remove()
  })

  it("does nt crash when the target DOM element does not exist", async()=>{
    const {result} = renderHook(()=> useLongStripNavigation({
      currentPage:2,
      totalPages:10
    }))

    act(()=>{
      result.current.requestScrollToPage(5)
    })

    await waitFor(()=>{
      expect(result.current.targetPage).toBe(5)
    })
  })
  it("scrolls to the next page", async()=>{
    const scrollIntoView = vi.fn()

    const element = document.createElement("div")

    element.setAttribute("data-page","4");
    element.scrollIntoView=scrollIntoView;
    document.body.appendChild(element)

    const {result} = renderHook(()=>
      useLongStripNavigation({currentPage:2,totalPages:10})
    )

    act(()=>{
      result.current.scrollToNextPage()
    })

    await waitFor(()=>{
      expect(scrollIntoView).toHaveBeenCalledWith({
        behavior:"auto",
        block:"start"
      })
    })

    expect(result.current.targetPage).toBeNull()

    element.remove();
  })

  it("scrolls to the prevous page", async()=>{
    const scrollIntoView = vi.fn()

    const element = document.createElement("div")

    element.setAttribute('data-page', '2')
    element.scrollIntoView= scrollIntoView

    document.body.appendChild(element)

    const{result} = renderHook(()=> useLongStripNavigation({
      currentPage:2,
      totalPages:10,
    }))

    act(()=>{
      result.current.scrollToPreviousPage()
    })

    await waitFor(()=>{
      expect(scrollIntoView).toHaveBeenCalledWith({
        behavior:"auto",
        block:"start"
      })
    })

    expect(result.current.targetPage).toBeNull()
    element.remove()
  })

  it("does not go beyond the last page when scrolling next,", ()=>{
    const {result} = renderHook(()=>useLongStripNavigation({
      currentPage:4,
      totalPages:5
    }))

    act(()=>{
      result.current.scrollToNextPage()
    })

    expect(result.current.targetPage).toBeNull()
  })

  it("does not go before the first page when scrolling previous", ()=>{
    const {result} = renderHook(()=>
      useLongStripNavigation({
        currentPage:0,
        totalPages:5
      })
    )

    act(()=>{
      result.current.scrollToPreviousPage()
    })

    expect(result.current.targetPage).toBeNull()
  })


});
