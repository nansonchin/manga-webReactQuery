import {mangaKeys} from '../queryKeys'
import { fetchMangaDetails, fetchMangaList } from "../../../api/mangadex"

export const mangaQueries ={
    infiniteList(){
        return {
            queryKey:mangaKeys.list(),
            queryFn:({pageParam}:{pageParam:number})=>fetchMangaList(pageParam),
        }
    },
    detail(id:string){
        return{
            queryKey:mangaKeys.detail(id),
            queryFn:()=>fetchMangaDetails(id)
        }
    }
}