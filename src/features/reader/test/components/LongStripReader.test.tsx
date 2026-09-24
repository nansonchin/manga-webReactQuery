import { describe, expect, it, should, vi } from "vitest";
import LongStripReader from "../../components/LongStripReader/LongStripReader";
import { render, screen } from "@testing-library/react";

vi.mock("../../components/ReaderImage/ReaderImage",()=>({
    default:({
        src,
        alt,
        shouldLoad,
    }:{
        src:string;
        alt:string;
        shouldLoad:boolean;
    })=>(
        <img src={src} alt={alt} data-should-load={String(shouldLoad)}/>
    )
}))

describe("Long StripReader",()=>{
    const pages = [
        {
            index:0,
            url:"page-1.jpg",
        },
        {
            index:1,
            url:"page-2.jpg",
        },
        {
            index:2,
            url:"page-3.jpg",
        },
        {
            index:3,
            url:"page-4.jpg",
        },
        {
            index:4,
            url:"page-5.jpg",
        },
    ]

    it("renders all pages",()=>{
      const oberservePage = vi.fn()
      
      render(
        <LongStripReader pages={pages} currentPage={0} renderAhead={2} targetPage={null} observePage={oberservePage}/>
      )

      expect(screen.getByAltText("Page 1")).toBeInTheDocument()
      expect(screen.getByAltText("Page 2")).toBeInTheDocument()
      expect(screen.getByAltText("Page 3")).toBeInTheDocument()
      expect(screen.getByAltText("Page 4")).toBeInTheDocument()
      expect(screen.getByAltText("Page 5")).toBeInTheDocument()

    })

    it("loads pages up to renderAhead from the  current page",()=>{
        const observePage=vi.fn()

        render(
            <LongStripReader pages={pages} currentPage={1} renderAhead={1} targetPage={null} observePage={observePage}/>
        )
        const page1=screen.getByAltText("Page 1")
        const page2=screen.getByAltText("Page 2")
        const page3=screen.getByAltText("Page 3")
        const page4=screen.getByAltText("Page 4")
        const page5=screen.getByAltText("Page 5")

        expect(page1).toHaveAttribute("data-should-load","true")
        expect(page2).toHaveAttribute("data-should-load","true")
        expect(page3).toHaveAttribute("data-should-load","true")
        expect(page4).toHaveAttribute("data-should-load","false")
        expect(page5).toHaveAttribute("data-should-load","false")

    })

    it("uses targetPage when it is further than currentPage",()=>{
        const observePage = vi.fn()

        render(
            <LongStripReader
                pages={pages}
                currentPage={1}
                renderAhead={1}
                targetPage={3}
                observePage={observePage}
            />
        )

               const page1=screen.getByAltText("Page 1")
        const page2=screen.getByAltText("Page 2")
        const page3=screen.getByAltText("Page 3")
        const page4=screen.getByAltText("Page 4")
        const page5=screen.getByAltText("Page 5")

        expect(page1).toHaveAttribute("data-should-load","true")
        expect(page2).toHaveAttribute("data-should-load","true")
        expect(page3).toHaveAttribute("data-should-load","true")
        expect(page4).toHaveAttribute("data-should-load","true")
        expect(page5).toHaveAttribute("data-should-load","true")
    })

    it("passes each page element to observePage",()=>{
        const observePage = vi.fn()
        render(
            <LongStripReader pages={pages} currentPage={0} renderAhead={1} targetPage={null} observePage={observePage}/>
        )
        expect(observePage).toHaveBeenCalledTimes(pages.length)

        for(const page of pages){
            const calls = observePage.mock.calls;

            const matchingCall = calls.find(
                ([element])=> element instanceof HTMLDivElement && element.dataset.page === String(page.index +1)
            )

            expect(matchingCall).toBeDefined()
        }
    })

    it("sets the correct data-page value for each page",()=>{
        const observePage = vi.fn()

        render(
            <LongStripReader
                pages={pages}
                currentPage={0}
                renderAhead={1}
                targetPage={null}
                observePage={observePage}
            />
        )

        for(const page of pages){
            const element = screen.getByAltText(`Page ${page.index+1}`)
            expect(element.parentElement).toHaveAttribute("data-page",String(page.index+1))
        }
    })
})
