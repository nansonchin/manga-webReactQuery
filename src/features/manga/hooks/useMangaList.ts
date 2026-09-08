import {useQuery} from "@tanstack/react-query"
import { fetchMangaList } from "../../../api/mangadex"
import { mangaKeys } from "../queryKeys"
import { mangaQueries } from "../queries/mangaQueries"

export function useMangaList(){
    return useQuery(mangaQueries.list())
}