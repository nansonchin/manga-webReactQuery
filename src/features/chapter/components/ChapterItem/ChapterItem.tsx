import { Link } from "react-router-dom";
import type { Chapter } from "../../types";
import { usePrefetchChapterPages } from "../../../reader/hooks/usePrefetchChapterPages";
import { useHoverPrefetch } from "../../../reader/hooks/useHoverPrefetch";

type ChapterItemProps={
    chapter:Chapter;
}

function ChapterItem({
    chapter
}:ChapterItemProps){
    const prefetchChapterPages = usePrefetchChapterPages()

    const hoverProps = useHoverPrefetch(()=>{
        prefetchChapterPages(chapter.id)
    })
    return(
        <Link
            to={`/chapter/${chapter.id}`}
            className="chapter-link"
            {...hoverProps}
        >
              <div className="chapter-item">


                <div>
                    Chapter {chapter.chapter ?? "-"}
                </div>


                <div>
                    {chapter.title || "No title"}
                </div>


                <div>
                    {chapter.translatedLanguage}
                </div>


            </div>
        </Link>
    )
}

export default ChapterItem;