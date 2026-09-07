import {useQuery} from "@tanstack/react-query"
import { fetchMangaList } from "../../../api/mangadex"
import { mangaKeys } from "../queryKeys"

export function useMangaList(){
    return useQuery({
        queryKey:mangaKeys.list(),
        queryFn:fetchMangaList
    })
}