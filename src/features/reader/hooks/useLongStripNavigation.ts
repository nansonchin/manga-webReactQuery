import type { ReactVirtualizer, Virtualizer } from "@tanstack/react-virtual";
import { useCallback, useEffect, useState } from "react";

type UseLongStripNavigationProps ={
    currentPage:number;
    totalPages:number;
    virtualizer:ReactVirtualizer<HTMLElement, Element>
}

export function useLongStripNavigation ({
    currentPage,
    totalPages,
    virtualizer,
}:UseLongStripNavigationProps){
    // const [ targetPage, setTargetPage]= useState<number|null>(null)
    
    // const clamPage = useCallback((page:number)=>{
    //     if(totalPages<=0){
    //         return
    //     }

    //     return Math.min(Math.max(page,0),totalPages-1)
    // },[totalPages])

    const requestScrollToPage =useCallback((page:number)=>{
        if(totalPages<=0){
            return
        }

        const safePage = Math.min(
            Math.max(page,0),
            totalPages-1
        )
        if(safePage === undefined){
            return
        }
        // setTargetPage(safePage)
        virtualizer.scrollToIndex(safePage,{
            align:"start",
            behavior:"auto"
        })
    },[totalPages])

    // useEffect(()=>{
    //     if(targetPage === null ){
    //         return
    //     }

    //     const element = document.querySelector<HTMLElement>(`[data-page="${targetPage+1}"]`)

    //     if(!element){
    //         return
    //     }

    //     element.scrollIntoView({
    //         behavior:"auto",
    //         block:"start"
    //     })

    //     setTargetPage(null)
    // },[targetPage])

    const scrollToNextPage = useCallback(()=>{
        if(totalPages<=0){
            return;
        }

        if(currentPage >=totalPages-1){
            return
        }

        requestScrollToPage(currentPage+1)
    },[currentPage, requestScrollToPage, totalPages])

    const scrollToPreviousPage = useCallback(()=>{
        if(currentPage<=0){
            return;
        }

        requestScrollToPage(currentPage-1)
    },[currentPage,requestScrollToPage])

    return{
        targetPage:null,
        requestScrollToPage,
        scrollToNextPage,
        scrollToPreviousPage,
    }
}