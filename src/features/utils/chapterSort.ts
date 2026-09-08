import type { Chapter } from "../chapter/types";

export function sortChapters(
    chapters:Chapter[]
):Chapter[]{
    // to prevent mutation ...chapters
    return [...chapters].sort((a,b)=>{
        const chapterA = Number(a.chapter);
        const chapterB = Number(b.chapter)

        if(Number.isNaN(chapterA)){
            return 1
        }

        if(Number.isNaN(chapterB)){
            return -1
        }

        return chapterB-chapterA;
    })
}