import {mangaKeys} from '../queryKeys'
import { fetchMangaDetails, fetchMangaList } from "../../../api/mangadex"

export const mangaQueries ={
    list(){
        return {
            queryKey:mangaKeys.list(),
            queryFn:fetchMangaList,
        }
    },
    detail(id:string){
        return{
            queryKey:mangaKeys.detail(id),
            queryFn:()=>fetchMangaDetails(id)
        }
    }
}