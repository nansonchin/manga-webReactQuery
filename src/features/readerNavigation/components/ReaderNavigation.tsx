type Chapter={
    id:string;
}

type NavigationStatus =
    | "idle"
    | "loading"
    |   "error"

type ReaderNavigationProps ={
    previousChapter:Chapter|null
    nextChapter:Chapter|null
    hasPrevious:boolean
    hasNext:boolean
    onPrevious:()=>void
    onNext:()=>void
    isLoadingPrevious:boolean
    isPreviousError:boolean
    navigationStatus:NavigationStatus
}

function ReaderNavigation({
    previousChapter,
    nextChapter,
    hasPrevious,
    hasNext,
    onPrevious,
    onNext,
    isLoadingPrevious,
    isPreviousError,
    navigationStatus
}:ReaderNavigationProps){
    const isLoading = navigationStatus === "loading"
    const isError = navigationStatus === "error"
    return(
        <div className="reader-navigation">
            <button disabled={!hasPrevious || isLoading} onClick={onPrevious}>{isLoading? "Loading" :"Previous Button"}</button>
            <span>Current Chapter</span>
            <button disabled={!hasNext} onClick={onNext}>Next Chapter</button>
            {isError && (
                <div role="alert" style={{color:'red',marginTop:8}}>Failed to load previous chapter</div>
            )}
        </div>
    )
}

export default ReaderNavigation;