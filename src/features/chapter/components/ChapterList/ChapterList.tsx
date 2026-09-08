import type { Chapter } from "../../types"
import ChapterItem from "../ChapterItem/ChapterItem"

type ChapterListProps={
    chapters:Chapter[]
}

function ChapterList({
    chapters,
}:ChapterListProps){
    return(
        <div>
            {chapters.map((chapter)=>(
                <ChapterItem key={chapter.id} chapter={chapter}/>
            ))}
            
        </div>
    )
}

export default ChapterList