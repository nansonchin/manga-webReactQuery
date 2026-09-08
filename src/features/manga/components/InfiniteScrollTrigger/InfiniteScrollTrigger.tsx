import { useEffect, useRef } from "react";

type InfiniteScrollTriggerProps={
    onLoadMore:()=>void;
    disabled:boolean;
}

function InfiniteScrollTrigger({
    onLoadMore,
    disabled
}:InfiniteScrollTriggerProps){
    const ref = useRef<HTMLDivElement|null>(null);

    useEffect(()=>{
        const element = ref.current;

        if(!element){
            return;
        }

        const observer= new IntersectionObserver((entries)=>{
            const entry = entries[0]
            if(entry.isIntersecting && !disabled){
                onLoadMore();
            }
        },{
            // target threshold for the sentinel
            threshold:1
        })

        observer.observe(element);

        return ()=>{
            observer.disconnect()
        }

    },[onLoadMore,disabled])

    return(
        <div ref={ref}>

            {
                disabled && <div>Loading more manga ...</div>
            }
        </div>
    )
}

export default InfiniteScrollTrigger