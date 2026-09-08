import { useQueryClient } from "@tanstack/react-query";
import { fetchMangaDetails } from "../../../api/mangadex";
import { mangaKeys } from "../queryKeys";
import { mangaQueries } from "../queries/mangaQueries";

export function usePrefetchManga(){
    const queryClient = useQueryClient();

    return (id:string)=>{
        queryClient.prefetchQuery(mangaQueries.detail(id))
    }
}