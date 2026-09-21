import { useInfiniteChapterList } from "../../chapter/hooks/useInfiniteChapterList";
import { useChapterPages } from "./useChapterPages";

type UseReaderDataProps={
    mangaId:string;
    chapterId:string;
}

export function useReaderData({
    mangaId,
    chapterId,
}:UseReaderDataProps){
    const chapterPagesQuery =useChapterPages(chapterId);
    const chapterListQuery = useInfiniteChapterList(mangaId)

    const chapters = chapterListQuery.data?.pages.flatMap((page)=>page.items)??[];

    const pages = chapterPagesQuery.data ?? []

    return{
        pages,
        chapters,
        pagesQuery:chapterPagesQuery,
        chaptersQuery:chapterListQuery
    }
}