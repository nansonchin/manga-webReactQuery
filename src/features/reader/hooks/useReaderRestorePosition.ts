import { useEffect, useRef } from "react";

type UseReaderRestorePositionProps ={
    restoredPage:number|null;
    hasRestored:boolean;
    isLongStrip:boolean;
    restorePage:(page:number)=>void
    requestScrollToPage:(pag:number)=>void;
}

export function useReaderRestorePosition({
    restoredPage,
    hasRestored,
    isLongStrip,
    restorePage,
    requestScrollToPage,
}:UseReaderRestorePositionProps){
    const hasAppliedRestoreRef = useRef(false)

    useEffect(()=>{

        hasAppliedRestoreRef.current= false;
        
    },[restorePage])
    useEffect(()=>{
        if(!hasRestored){
            return;
        }
        
    if(restoredPage === null){
        hasAppliedRestoreRef.current=true;

        return
    }

    if(hasAppliedRestoreRef.current){
        return;
    }

    restorePage(restoredPage)

    if(isLongStrip){
        requestScrollToPage(restoredPage)
    }
    hasAppliedRestoreRef.current=true
    },[hasRestored,restorePage,isLongStrip,restorePage,requestScrollToPage])

}