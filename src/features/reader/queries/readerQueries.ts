import { fetchChapterPages } from "../api/renderApi";

export const readerQueries={
    pages:(chapterId:string)=>({
        queryKey:[
            "chapter",
            "pages",
            chapterId
        ],
        queryFn:()=>fetchChapterPages(chapterId)
    })
}