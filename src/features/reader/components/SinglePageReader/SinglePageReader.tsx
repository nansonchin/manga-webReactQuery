import { useReaderTapNavigation } from "../../hooks/useReaderTapNavigation";
import ReaderImage from "../ReaderImage/ReaderImage";
import "./SinglePageReader.scss"

type ReaderPageData={
    index:number,
    url:string
}

type SinglePageReaderProps ={
    pages:ReaderPageData[];
    currentPage:number;
    // observePage:(
    //     element:HTMLElement|null,
    // )=>void;
    onNextPage:()=>void;
    onPreviousPage:()=>void;
};

function SinglePageReader({
    pages,
    currentPage,
    // observePage,
    onNextPage,
    onPreviousPage
}:SinglePageReaderProps){
    const {handleTap} = useReaderTapNavigation({
        previous:onPreviousPage,
        next:onNextPage
    })

    return(
        <div className="reader-single-page" onClick={handleTap}>
            {
                pages.map((page)=>{
                    const isCurrent= page.index === currentPage;

                    return(
                        <div
                            key={page.index}
                            data-page={page.index+1}
                            // ref={observePage}
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