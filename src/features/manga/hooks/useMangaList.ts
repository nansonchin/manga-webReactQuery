import {useQuery} from "@tanstack/react-query"
import { fetchMangaList } from "../../../api/mangadex"

export function useMangaList(){
    return useQuery({
        queryKey:["manga-list"],
        queryFn:fetchMangaList
    })
}