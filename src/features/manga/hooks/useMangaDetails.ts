import {useQuery} from "@tanstack/react-query"
import { fetchMangaDetails } from "../../../api/mangadex"
import { mangaKeys } from "../queryKeys"

export function useMangaDetail(id:string){
    return useQuery({
        queryKey:mangaKeys.detail(id),
        queryFn:()=>fetchMangaDetails(id),
        enabled:!!id
    })
}