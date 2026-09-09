import { useRef } from "react";

export function useHoverPrefetch(
    callback:()=>void,
    delay:number=1000
){
    const timerRef = useRef<number|null>(null)

    const onMouseEnter = ()=>{
        timerRef.current = window.setTimeout(()=>{
            callback()
        },delay)
    }

    const onMouseLeave =()=>{
        if(timerRef.current){
            clearTimeout(timerRef.current);
            timerRef.current = null
        }
    }

    return {
        onMouseEnter,
        onMouseLeave
    }
}