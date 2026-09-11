import ReaderImage from "../ReaderImage/ReaderImage";

type ReaderPageData={
    index:number,
    url:string
}

type SinglePageReaderProps ={
    pages:ReaderPageData[];
    currentPage:number;
    observePage:(
        element:HTMLElement|null,
    )=>void
};

function SinglePageReader({
    pages,
    currentPage,
    observePage,
}:SinglePageReaderProps){
    return(
        <div className="readeer-single-page">
            {
                pages.map((page)=>{
                    const isCurrent= page.index === currentPage;

                    return(
                        <div
                            key={page.index}
                            data-page={page.index+1}
                            ref={observePage}
                            className={isCurrent? "reader-single-page-item-active":"reader-single-page-item"}
                            aria-hidden={!isCurrent}
                        >
                            <ReaderImage
                                src={page.url}
                                alt={`Page ${page.index+1}`}
                                shouldLoad={isCurrent}
                            />
                        </div>
                    )
                })
            }
        </div>
    )
}

export default SinglePageReader