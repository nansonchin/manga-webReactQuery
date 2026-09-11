import { useEffect } from "react";

type UseKeyboardNavigationProps ={
    onNextPage:()=>void;
    onPreviousPage:()=>void;
    onNextChapter:()=>void;
    onPreviousChapter:()=>void;
}

export function useKeyboardNavigation({
    onNextPage,
    onPreviousPage,
    onNextChapter,
    onPreviousChapter,
}:UseKeyboardNavigationProps){

    useEffect(()=>{
            
    const handlerKeyDown=(event:KeyboardEvent)=>{
        switch(event.key){
            case "ArrowRight": event.preventDefault(); onNextChapter()
            break;

            case "ArrowLeft": event.preventDefault();onPreviousChapter()
            break;

            case "ArrowDown": event.preventDefault();onNextPage()
            break;

            case "ArrowUp": event.preventDefault();onPreviousPage()
            break;

            default:
                break;
        }    
    }

    window.addEventListener("keydown",handlerKeyDown)

    return(()=>{
        window.removeEventListener("keydown",handlerKeyDown)
    })
    
    },[onNextPage,onPreviousPage,onPreviousChapter,onNextChapter])


}