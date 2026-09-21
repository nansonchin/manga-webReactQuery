import type { ChapterListResponse } from "../features/chapter/types";

type Chapter = ChapterListResponse["items"][number];

type ChapterNavigation={
    previousChapter:Chapter|null,
    nextChapter:Chapter|null
}

export function getChapterNavigation(
    chapters:Chapter[],
    currentChapterId:string,
):ChapterNavigation{
    const currentIndex = chapters.findIndex(
        (chapter)=>chapter.id === currentChapterId
    )

    const previousChapter = currentIndex >= 0 && currentIndex < chapters.length-1 ? chapters[currentIndex+1]:null;

    const nextChapter = currentIndex >0 ? chapters[currentIndex-1]:null

    return{
        previousChapter,
        nextChapter
    }
}