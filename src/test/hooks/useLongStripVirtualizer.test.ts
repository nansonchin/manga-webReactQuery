import { describe, it } from "vitest"
import { useLongStripVirtualizer } from "../../features/reader/hooks/useLongStripVirtualizer"
import { renderHook } from "@testing-library/react"

describe("useLongStripVirtualizer",()=>{
    describe("initial render",()=>{
        it("renders the first page and render-ahead pages initially", ()=>{
            const {result} = renderHook(()=> useLongStripVirtualizer({
                currentPage:0,
                totalPages:10,
                renderAhead:2
            }))
        })
    })
})