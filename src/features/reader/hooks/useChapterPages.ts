import { useQuery } from "@tanstack/react-query";
import { readerQueries } from "../queries/readerQueries";
import { normalizeChapterPages } from "../mapper/readerMapper";

export function useChapterPages(
    chapterId:string
){
    return useQuery(
       {
         ...readerQueries.pages(chapterId),
        select:(data)=>(
            // data contains chapter and  base URL and return back as array and the the array data will return back to query so we can use the data as array
            normalizeChapterPages(data)
        )
       }
    )
}