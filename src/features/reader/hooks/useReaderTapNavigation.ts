import { useCallback } from "react";

type ReaderTapNavigationProps = {
    previous:()=> void;
    next:()=>void
}

export function useReaderTapNavigation({
    previous,
    next,
}:ReaderTapNavigationProps){
    const handleTap = useCallback((event:React.MouseEvent<HTMLElement>)=>{
        const {clientX} = event;
        const {left, width}= event.currentTarget.getBoundingClientRect();

        const clickPosition = clientX - left;
        const middle = width/2

        if(clickPosition<middle){
            console.log("Clicked Previous")

            previous()
        }else{
            console.log("Clicked Next")
            next()
        }
    },[previous,next])

    return({
        handleTap
    }
    )
}