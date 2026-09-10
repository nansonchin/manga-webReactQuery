type Chapter={
    id:string;
}

type ReaderNavigationProps ={
    previousChapter:Chapter|null
    nextChapter:Chapter|null
    hasPrevious:boolean
    hasNext:boolean
    onPrevious:()=>void
    onNext:()=>void
    isLoadingPrevious:boolean
}

function ReaderNavigation({
    previousChapter,
    nextChapter,
    hasPrevious,
    hasNext,
    onPrevious,
    onNext,
    isLoadingPrevious,
}:ReaderNavigationProps){
    return(
        <div className="reader-navigation">
            <button disabled={!hasPrevious || isLoadingPrevious} onClick={onPrevious}>Previous Chapter</button>
            <span>Current Chapter</span>
            <button disabled={!hasNext} onClick={onNext}>Next Chapter</button>
        </div>
    )
}

export default ReaderNavigation;