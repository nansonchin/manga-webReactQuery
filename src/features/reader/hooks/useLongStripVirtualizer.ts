import { useVirtualizer } from "@tanstack/react-virtual"
import { useRef } from "react"

type UseLongStripVirtualizerProps={
    count:number
}

export function useLongStripVirtualizer({
    count,
}:UseLongStripVirtualizerProps){
    const parentRef = useRef<HTMLElement|null>(null)

    const virtualizer = useVirtualizer({
        count,
        getScrollElement:()=>parentRef.current,
        estimateSize:()=> 800, //800px for each size reader page div
        overscan:2,
        measureElement:(element)=>{
            return element.getBoundingClientRect().height //excat size for each size reader page div
        }
    })

    return {
        parentRef,
        virtualizer
    }
}