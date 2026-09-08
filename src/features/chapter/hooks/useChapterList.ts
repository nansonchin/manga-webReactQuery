import { useQuery } from "@tanstack/react-query";
import { chapterQueries } from "../queries/chapterQueries";

export function useChapterList(
    mangaId:string
){
    return useQuery(
        chapterQueries.list(mangaId)
    )
}