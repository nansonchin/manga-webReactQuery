import { useQueryClient } from "@tanstack/react-query"
import { readerQueries } from "../queries/readerQueries"

export function usePrefetchChapterPages(){
    // prefetch Chapter page from chapter list when user hover on the chapter in chapter details page
    const queryClient = useQueryClient()

    return (chapterId:string)=>{
        queryClient.prefetchQuery(
            readerQueries.pages(chapterId)
        )
    }
}