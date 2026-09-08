import { useEffect, useRef } from "react";

type InfiniteScrollTriggerProps={
    onLoadMore:()=>void;
    enabled:boolean;
}

function InfiniteScrollTrigger({
    onLoadMore,
    enabled
}:InfiniteScrollTriggerProps){
    const ref = useRef<HTMLDivElement|null>(null);

    useEffect(()=>{
        const element = ref.current;

        if(!element){
            return;
        }

        const observer= new IntersectionObserver((entries)=>{
            const entry = entries[0]
            if(entry.isIntersecting && enabled){
                onLoadMore();
            }
        },{
            // target threshold for the sentinel
            // threshold:1
            rootMargin:"200px"
        })

        observer.observe(element);

        return ()=>{
            observer.disconnect()
        }

    },[onLoadMore,enabled])

    return(
        <div ref={ref}/>
    )
}

export default InfiniteScrollTrigger