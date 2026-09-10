import type { Chapter } from "../../types"
import ChapterItem from "../ChapterItem/ChapterItem"

type ChapterListProps={
    chapters:Chapter[]
    mangaId:string
}

function ChapterList({
    chapters,
    mangaId,
}:ChapterListProps){
    return(
        <div>
            {chapters.map((chapter)=>(
                <ChapterItem mangaId={mangaId} key={chapter.id} chapter={chapter}/>
            ))}
            
        </div>
    )
}

export default ChapterList