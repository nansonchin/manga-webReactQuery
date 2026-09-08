import {useInfiniteQuery, useQuery} from "@tanstack/react-query"
import { fetchMangaList } from "../../../api/mangadex"
import { mangaKeys } from "../queryKeys"
import { mangaQueries } from "../queries/mangaQueries"

export function useMangaList(){
    return useInfiniteQuery({
        ...mangaQueries.infiniteList(),
        initialPageParam:0,
        getNextPageParam:(lastPage,pages)=>{
            const loaded = pages.reduce(
                (sum,page)=>sum + page.items.length,0
            )
            if(loaded >=lastPage.total){
                return undefined
            }

            return pages.length;
        }
    })
}