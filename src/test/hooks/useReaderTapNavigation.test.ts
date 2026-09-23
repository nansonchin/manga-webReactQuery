import { describe, expect, it, vi } from "vitest";
import { useReaderTapNavigation } from "../../features/reader/hooks/useReaderTapNavigation";
import { renderHook } from "@testing-library/react";

function createTapEvent(
    clientX:number,
    left:number,
    width:number
):React.MouseEvent<HTMLElement>{
    const element = document.createElement("div");

    element.getBoundingClientRect=()=>({
        top:0,
        bottom:100,
        left,
        right:left+width,
        width,

        height:100,
        x:left,
        y:0,
        toJSON:()=>{}
    })

    return{
        clientX,
        currentTarget:element,
    } as unknown as React.MouseEvent<HTMLElement>;
}

describe("useReaderTapNavigation",()=>{
    it("calls previous when tapping the left half",()=>{
        const previous = vi.fn()
        const next = vi.fn()

        const {result}=renderHook(()=>useReaderTapNavigation({previous,next}))
    
        const event = createTapEvent(200,100,800)

        result.current.handleTap(event);

        expect(previous).toHaveBeenCalledTimes(1)
        expect(next).not.toHaveBeenCalled()
    })

    it("calls next when tapping the right half",()=>{
        const previous = vi.fn()
        const next = vi.fn()
        
        const {result}= renderHook(()=>useReaderTapNavigation({previous,next}))

        const event = createTapEvent(700,100,800)

        result.current.handleTap(event)

        expect(next).toHaveBeenCalledTimes(1)
        expect(previous).not.toHaveBeenCalled()
    })

    it("calls previous when taping near the left edge",()=>{

        const previous = vi.fn()
        const next = vi.fn()

        const {result} = renderHook(()=>useReaderTapNavigation({previous,next}))

        const event = createTapEvent(101,100,800)

        result.current.handleTap(event)

        expect(previous).toHaveBeenCalledTimes(1)
        expect(next).not.toHaveBeenCalled()
    })

    it("calls next when tapping near the right edge",()=>{
        const previous = vi.fn()
        const next = vi.fn()

        const {result} =renderHook(()=>useReaderTapNavigation({previous,next}))
        const event = createTapEvent(899,100,800)

        result.current.handleTap(event)

        expect(next).toHaveBeenCalledTimes(1)
        expect(previous).not.toHaveBeenCalled()
    })
})