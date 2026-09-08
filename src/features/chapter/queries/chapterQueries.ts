import { fetchChapterList } from "../api/chapterApi";

export const chapterQueries ={
    list:(mangaId:string)=>({
        queryKey:[
            "chapter",
            mangaId,
        ],
        queryFn:()=>fetchChapterList(mangaId)
    }),
    
}