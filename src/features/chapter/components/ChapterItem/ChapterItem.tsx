import { Link } from "react-router-dom";
import type { Chapter } from "../../types";

type ChapterItemProps={
    chapter:Chapter;
}

function ChapterItem({
    chapter
}:ChapterItemProps){
    return(
        <Link
            to={`/chapter/${chapter.id}`}
            className="chapter-link"
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