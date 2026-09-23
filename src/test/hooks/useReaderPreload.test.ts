import { beforeEach, describe, expect, it, vi } from "vitest";
import { preloadImage } from "../../features/utils/imagePreloader";
import type { ChapterPage } from "../../features/reader/types";
import { renderHook } from "@testing-library/react";
import { useReaderPreload } from "../../features/reader/hooks/useReaderPreload";
import { preload } from "react-dom";

vi.mock( "../../features/utils/imagePreloader",()=>({
    preloadImage:vi.fn()
}))

describe("useReaderPreload",()=>{
    const pages:ChapterPage[]=[
        {
            index:0,
            url:"page-0.jpg"
        },
        {
            index:1,
            url:"page-1.jpg"
        },
        {
            index:2,
            url:"page-2.jpg"
        },
        {
            index:3,
            url:"page-3.jpg"
        },
        {
            index:4,
            url:"page-4.jpg"
        },
        {
            index:5,
            url:"page-5.jpg"
        },
        {
            index:6,
            url:"page-6.jpg"
        }
        
    ]

    beforeEach(()=>{
        vi.clearAllMocks()
    })

    it("preload the next pages after the current page",()=>{
    renderHook(()=>useReaderPreload(pages,2,3))
    
    expect(preloadImage).toHaveBeenCalledTimes(3)

    expect(preloadImage).toHaveBeenNthCalledWith(1,"page-3.jpg")
    expect(preloadImage).toHaveBeenNthCalledWith(2,"page-4.jpg")


    expect(preloadImage).toHaveBeenNthCalledWith(3,"page-5.jpg")
    })

    it("does not preload the current page",()=>{
        renderHook(()=>{
            useReaderPreload(pages,2,3)
        })
    })

    it("does not preload more pages than preloadCount the current page",()=>{
        renderHook(()=>useReaderPreload(pages,2,2))

        expect(preloadImage).toHaveBeenCalledTimes(2)

        expect(preloadImage).toHaveBeenNthCalledWith(1,"page-3.jpg")
        expect(preloadImage).toHaveBeenNthCalledWith(2,"page-4.jpg")
    })
})