import {useQuery} from "@tanstack/react-query"
import { fetchMangaDetails } from "../../../api/mangadex"
import { mangaKeys } from "../queryKeys"
import {mangaQueries} from '../queries/mangaQueries.ts'

export function useMangaDetail(id:string){
    return useQuery(
        mangaQueries.detail(id)
    )
}