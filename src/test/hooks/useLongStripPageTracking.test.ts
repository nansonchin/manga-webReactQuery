import { beforeEach, describe, expect, it, vi } from "vitest";
import { useLongStripPageTracking } from "../../features/reader/hooks/useLongStripPageTracking";
import { act, renderHook } from "@testing-library/react";
import { createElement } from "react";

type ObserverCallback = IntersectionObserverCallback;

let observerCallBack: ObserverCallback;
let observedElements: Element[];

const observeMock = vi.fn()
const disconnectMock = vi.fn()

class MockIntersectionObserver {
  constructor(callback: ObserverCallback, _options?: IntersectionObserverInit) {
    observerCallBack = callback;
  }

  observe(element: Element) {
    observeMock(element)
  }

  unobserve(_element: Element) {}

  disconnect() {
    disconnectMock()
  }
}

function createPageElement(
    page:number,
    rect:{
        top:number,
        height:number
    },
){
    const element = document.createElement("div")

    element.setAttribute("data-page",String(page))

    element.getBoundingClientRect=()=>({
        top:rect.top,
        bottom:rect.top+rect.height,
        left:0,
        right:100,
        width:100,
        height:rect.height,
        x:0,
        y:rect.top,
        toJSON:()=>{}
    })

    return element
}

function createIntersectionEntry(
    element:HTMLElement,
    isIntersecting:boolean,
):IntersectionObserverEntry{

    return{
        target:element,
        isIntersecting,
        boundingClientRect:element.getBoundingClientRect(),
        intersectionRatio:isIntersecting?1:0,
        intersectionRect:element.getBoundingClientRect(),
        rootBounds:null,
        time:0
    }
}

describe("useLongStripPageTracking", () => {
  beforeEach(() => {
    observeMock.mockClear()
    disconnectMock.mockClear()
    
    vi.stubGlobal("IntersectionObserver",MockIntersectionObserver,)

    Object.defineProperty(window,"innerHeight",{
        configurable:true,
        value:1000,
    })
  });

  it("calls onPageCHange with the correctpage index when a page becomes visible", () => {
    const onPageChange = vi.fn();

    const { result } = renderHook(() =>
      useLongStripPageTracking({ enabled: true, onPageChange }),
    );

    const pageElement = createPageElement(1,{top:0,height:100})

    act(()=>{
        result.current.observePage(pageElement)
    })

    expect(observeMock).toHaveBeenCalledWith(pageElement)

    act(()=>{
        observerCallBack([createIntersectionEntry(pageElement,true)],{} as IntersectionObserver)
    })

    expect(onPageChange).toHaveBeenCalledWith(0);
  });

  it("selects the visible page closet to the viewport center", () => {
    const onPageChange = vi.fn();
    const { result } = renderHook(() =>
      useLongStripPageTracking({ enabled: true, onPageChange }),
    );

    const page1 = createPageElement(1,{top:100,height:200})
    const page2 = createPageElement(2,{top:450,height:100})

    act(()=>{
        result.current.observePage(page1)
        result.current.observePage(page2)
    })

    act(()=>{
        observerCallBack([
            createIntersectionEntry
            (page1,true),
            createIntersectionEntry(page2,true)
        ],{} as IntersectionObserver)
    })
    expect(onPageChange).toHaveBeenCalledWith(1)
  });

  it("does not observe pages when enabed is false",()=>{
    const onPageChange = vi.fn();

    const {result} = renderHook(()=>useLongStripPageTracking({
        enabled:false,
        onPageChange,
    }))

    const pageElement = createPageElement(1,{
        top:0,
        height:100,
    })
    act(()=>{

        result.current.observePage(pageElement)
    })

    expect(observeMock).not.toHaveBeenCalled()
    expect(onPageChange).not.toHaveBeenCalled()
  })

  it("removes a page from visible pages when it stops intersecting",()=>{
    const onPageChange =vi.fn()

    const {result} = renderHook(()=>useLongStripPageTracking({
        enabled:true,
        onPageChange,
    }))

    const page1= createPageElement(1,{
        top:450,
        height:100,
    })

    const page2 =createPageElement(2,{
        top:100,
        height:100
    })

    act(()=>{
        result.current.observePage(page1)

        result.current.observePage(page2)
    })

    act(()=>{
        observerCallBack([createIntersectionEntry(page1,true),createIntersectionEntry(page2,true)],
        {}as IntersectionObserver
    )
    })

    expect(onPageChange).toHaveBeenLastCalledWith(0)

    act(()=>{
        observerCallBack([createIntersectionEntry(page1,false)],{} as IntersectionObserver)
    })

    expect(onPageChange).toHaveBeenLastCalledWith(1)
  })

  it("does not call onPageChnge when no page is visible",()=>{
    const onPageChange = vi.fn()

    const {result} = renderHook(()=> useLongStripPageTracking({enabled:true,onPageChange}))
  
    const pageElement = createPageElement(1,{
        top:450,
        height:100
    })

    act(()=>{
        result.current.observePage(pageElement)
    })

    act(()=>{
        observerCallBack([createIntersectionEntry(pageElement,false)],{} as IntersectionObserver)
    })

    expect(onPageChange).not.toHaveBeenCalled()
})

it("disconnects the observer when the hook unmounts",()=>{
    const onPageChange = vi.fn();

    const {unmount} = renderHook(()=>useLongStripPageTracking({
        enabled:true,
        onPageChange,
    }))

    unmount();
    expect(disconnectMock).toHaveBeenCalledTimes(1)
})

it("ignores null elements passed to observePage",()=>{
    const onPageChange=vi.fn()

    const {result}=renderHook(()=>useLongStripPageTracking({enabled:true,onPageChange}))

    expect(()=>{
        act(()=>{
            result.current.observePage(null)
        })
    }).not.toThrow()

    expect(observeMock).not.toHaveBeenCalled()
})

it("observes pages that were registered before the observer was created",()=>{
    const onPageChange = vi.fn();

    const pageElement = createPageElement(1,{
        top:450,
        height:100
    })

    const {result,rerender} = renderHook(({enabled})=>useLongStripPageTracking({enabled,onPageChange}),{
        initialProps:{
            enabled:false
        }
    })

    act(()=>{
        result.current.observePage(pageElement)
    })

    expect(observeMock).not.toHaveBeenCalled()

    rerender({enabled:true})

    expect(observeMock).toHaveBeenCalledWith(pageElement)
})
});
