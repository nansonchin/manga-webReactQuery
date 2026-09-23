import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useKeyboardNavigation } from "../../features/reader/hooks/useKeyboardNavigation";

describe("useKeyboardNavigation",()=>{
    it("calls next when Arrow  right is pressed",()=>{
        const next = vi.fn();
        const previous = vi.fn();

        renderHook(()=> useKeyboardNavigation({controls:{next,previous}}))
    
        window.dispatchEvent(new KeyboardEvent("keydown",{
            key:"ArrowRight"
        }))

        expect(next).toHaveBeenCalledTimes(1)
        expect(previous).not.toHaveBeenCalled()
    })

    it("calls next when  arrowDown is pressed",()=>{
        const next = vi.fn()
        const previous = vi.fn()

        renderHook(()=>useKeyboardNavigation({
            controls:{
                next,
                previous,
            }
        }))

        window.dispatchEvent(new KeyboardEvent("keydown",{
            key:"ArrowDown"
        }))

        expect(next).toHaveBeenCalledTimes(1)
        expect(previous).not.toHaveBeenCalled()
    })

    it('calls previous when ArrowLeft is pressed',()=>{
        const next = vi.fn();
        const previous = vi.fn()

        renderHook(()=> useKeyboardNavigation({
            controls:{next,previous}
        }))

        window.dispatchEvent(new KeyboardEvent("keydown",{key:"ArrowLeft"}))
    
        expect(previous).toHaveBeenCalledTimes(1)
        expect(next).not.toHaveBeenCalled()
    })

    it("calls previous when  arrowUp is pressed", ()=>{
        const next = vi.fn()

        const previous = vi.fn()

        renderHook(()=>{
            useKeyboardNavigation({
                controls:{
                    next,previous
                }
            })
        })

        window.dispatchEvent(new KeyboardEvent("keydown",{
            key:"ArrowUp"
        }))

        expect(previous).toHaveBeenCalledTimes(1)
        expect(next).not.toHaveBeenCalled()
    })

    it("does not respond when enabled is false", ()=>{
        const next = vi.fn();
        const previous = vi.fn()

        renderHook(()=>useKeyboardNavigation({controls:{next,previous},enabled:false}))

        window.dispatchEvent(new KeyboardEvent("keydown",{
            key:"Arrow Right",
        }))

        window.dispatchEvent(new KeyboardEvent("keydown",{
            key:"ArrowLeft"
        }))

        expect(next).not.toHaveBeenCalled()
        expect(previous).not.toHaveBeenCalled()
    })

    it("does not respond when the event target is an input",()=>{
        const next = vi.fn()
        const previous = vi.fn()

        renderHook(()=>{
            useKeyboardNavigation({controls:{next,previous}})
        })

        const input  = document.createElement("input")
        document.body.appendChild(input)

        input.dispatchEvent(new KeyboardEvent("keydown",{
            key:"ArrowRight",bubbles:true,
        }))

        expect(next).not.toHaveBeenCalled()
        expect(previous).not.toHaveBeenCalled()
        input.remove()
    })

    it("does not respond when the event target is a textarea",()=>{
        const next = vi.fn()
        const previous = vi.fn()

        renderHook(()=>{
            useKeyboardNavigation({
                controls:{
                    next,previous

                }
            })
        })

        const textarea = document.createElement("textarea")
        document.body.appendChild(textarea)

        textarea.dispatchEvent(
            new KeyboardEvent("keydown",{
                key:"ArrowRight",
                bubbles:true
            })
        )

        expect(next).not.toHaveBeenCalled();
        expect(previous).not.toHaveBeenCalled()

        textarea.remove()
    })

    it("does not respond when the  event target is a select",()=>{
         const next = vi.fn()
        const previous = vi.fn()

        renderHook(()=>{
            useKeyboardNavigation({
                controls:{
                    next,previous

                }
            })
        })
        
        const select = document.createElement("select")
        document.body.appendChild(select)

        select.dispatchEvent(new KeyboardEvent("keydown",{key:"ArrowRight",bubbles:true}))
        
        expect(next).not.toHaveBeenCalled();
        expect(previous).not.toHaveBeenCalled()
        
        select.remove()
    })

    it("does not respond when the event target is content Editable",()=>{
         const next = vi.fn()
        const previous = vi.fn()

        renderHook(()=>{
            useKeyboardNavigation({
                controls:{
                    next,previous

                }
            })
        })

        const editor = document.createElement("div")

        Object.defineProperty(editor,"isContentEditable",{
            configurable:true,
            value:true
        })

        document.body.appendChild(editor)

        editor.dispatchEvent(new KeyboardEvent("keydown",{
            key:"ArrowRight",
            bubbles:true
        }))

        expect(next).not.toHaveBeenCalled();
        expect(previous).not.toHaveBeenCalled();

        editor.remove()
    })

    it("removes the keyboard listener when the hook unmounts",()=>{
        const next=vi.fn();
        const previous=vi.fn()

        const {unmount} = renderHook(()=>useKeyboardNavigation({
            controls:{
                next,previous
            }
        }))

        unmount();

        window.dispatchEvent(new KeyboardEvent("keydown",{key:"ArrowRight"}))

        expect(next).not.toHaveBeenCalled()
        expect(previous).not.toHaveBeenCalled()
    })
})