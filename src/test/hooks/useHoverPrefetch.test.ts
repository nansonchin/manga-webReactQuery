import { act, renderHook } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { useHoverPrefetch } from "../../features/reader/hooks/useHoverPrefetch"

describe("useHoverprefetch",()=>{
    beforeEach(()=>{
        vi.useFakeTimers()
    })

    afterEach(()=>{
        vi.clearAllTimers()
        vi.useRealTimers()
    })

    it("does not call the calback immediately when mouse enters",()=>{
        const callback= vi.fn()
        
        const {result} = renderHook(()=>
            useHoverPrefetch(callback,100)
        )

        act(()=>{
            result.current.onMouseEnter()
        })

        expect(callback).not.toHaveBeenCalled()
    })

    it("calls the callback  after the delay",()=>{
        const callback = vi.fn();
        const {result} = renderHook(()=>useHoverPrefetch(callback,1000))

        act(()=>{
            result.current.onMouseEnter()
        })

        expect(callback).not.toHaveBeenCalled()

        act(()=>{
            vi.advanceTimersByTime(1000)
        })

        expect(callback).toHaveBeenCalledTimes(1)
    })

    it("does not call the callback if mouse leaves before the delay",()=>{
        const callback = vi.fn();
        const {result} = renderHook(()=> useHoverPrefetch(callback,1000))

        act(()=>{
            result.current.onMouseEnter()
        })

        act(()=>{
            vi.advanceTimersByTime(500);
        })

        act(()=>{
            result.current.onMouseLeave()
        })

        act(()=>{
            vi.advanceTimersByTime(500)
        })
        expect(callback).not.toHaveBeenCalled()
    })

    it("uses the custom delay",()=>{
        const callback = vi.fn()

        const {result}= renderHook(()=>useHoverPrefetch(callback,2000))

        act(()=>{
            result.current.onMouseEnter()
            vi.advanceTimersByTime(1000)

        })

        expect(callback).not.toHaveBeenCalled()

        act(()=>{
            vi.advanceTimersByTime(1000)
        })

        expect(callback).toHaveBeenCalledTimes(1)
       
    })
})