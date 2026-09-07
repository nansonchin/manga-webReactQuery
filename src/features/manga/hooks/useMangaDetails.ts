import {useQuery} from "@tanstack/react-query"
import { fetchMangaDetails } from "../../../api/mangadex"

export function useMangaDetail(id:string){
    return useQuery({
        queryKey:["manga-detail",id],
        queryFn:()=>fetchMangaDetails(id),
        enabled:!!id
    })
}