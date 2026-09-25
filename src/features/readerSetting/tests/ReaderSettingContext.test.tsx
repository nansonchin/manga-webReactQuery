import { beforeEach, describe, expect, it } from "vitest";
import { initialReaderSettings, ReaderSettingsProvider, useReaderSettings } from "../context/ReaderSettingContext";
import { act, render, renderHook } from "@testing-library/react";

const STORAGE_KEY = "manga-reader-settings";

function wrapper({children}:{children:React.ReactNode}){
    return(
        <ReaderSettingsProvider>
            {children}
        </ReaderSettingsProvider>
    )
}

describe("Reader Sttings Provider",()=>{
    beforeEach(()=>{
        localStorage.clear()
    })

    it("use default settings when localStorage is empty",()=>{
        const {result} = renderHook(()=>useReaderSettings(),{
            wrapper
        })
        expect(result.current.settings).toEqual(
            initialReaderSettings
        )
    })

    it("restores page mode from localStorage",()=>{
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({
                pageMode:"single-page",
                theme:"light"
            })
        )

        const {result} = renderHook(
            ()=> useReaderSettings(),{
                wrapper
            }
        )

        expect(result.current.settings.pageMode).toBe(
            "single-page"
        )
    })

    it("restores theme from localStorage",()=>{
        localStorage.setItem(STORAGE_KEY,JSON.stringify({
            pageMode:"long-strip",
            theme:"dark"
        }))

        const {result} = renderHook(()=>useReaderSettings(),{wrapper})

        expect(result.current.settings.theme).toBe("dark")
    })

    it("saves page mode to localStorage", ()=>{
        const {result} = renderHook(()=>useReaderSettings(),{wrapper})

        act(()=>{
            result.current.dispatch({
                type:"SET_PAGE_MODE",
                payload:"single-page"
            })
        })

        expect(result.current.settings.pageMode).toBe("single-page")
    
        expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!)).toEqual({
            pageMode:"single-page",
            theme:"light"
        })
    })

    it('saves theme to localStorage',()=>{
        const { result }= renderHook(()=>useReaderSettings(),{
            wrapper
        })

        act(()=>{
            result.current.dispatch({
                type:"SET_COLOR",
                payload:"dark"
            })
        })

        expect(result.current.settings.theme).toBe(
            "dark"
        )

        expect(
            JSON.parse(localStorage.getItem(STORAGE_KEY)!)
        ).toEqual({
            pageMode:"long-strip",
            theme:"dark"
        })
    })

    it("resets settings and persists defaults",()=>{
        const {result}= renderHook(
            ()=> useReaderSettings(),{
                wrapper
            }
        )

        act(()=>{
            result.current.dispatch({
                type:"SET_PAGE_MODE",
                payload:"single-page"
            })

            result.current.dispatch({
                type:"SET_COLOR",
                payload:"dark"
            })
        })

        expect(result.current.settings).toEqual({
            pageMode:"single-page",
            theme:"dark"
        })

        act(()=>{
            result.current.dispatch({
                type:"RESET"
            })
        })

        expect(result.current.settings).toEqual(initialReaderSettings)

        expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!)).toEqual(initialReaderSettings

        )
    })

    it("falls back to defaults when localStorage contains invalid JSON",()=>{
        localStorage.setItem(
            STORAGE_KEY,
            "this is not vlaid JSON"
        )

        const {result }= renderHook(()=> useReaderSettings(),{
            wrapper
        })

        expect(result.current.settings).toEqual(initialReaderSettings)
    })

    it("falls back to defaults when localStorage contains invalid values",()=>{
        localStorage.setItem(STORAGE_KEY,"this is not valid JSON")

        const {result} = renderHook(()=> useReaderSettings(),{
            wrapper
        })

        expect(result.current.settings).toEqual(initialReaderSettings)
    })

})

