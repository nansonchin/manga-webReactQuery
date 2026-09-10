type ReaderNavigationProps ={
    chapterId:string;
}

function ReaderNavigation({
    chapterId,
}:ReaderNavigationProps){
    return(
        <div className="reader-navigation">
            <button>Previous Chapter</button>
            <span>{chapterId}</span>
            <button>Next Chapter</button>
        </div>
    )
}

export default ReaderNavigation;