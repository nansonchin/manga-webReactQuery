import type {Chapter} from "../types"

export async function fetchChapterList(
    mangaId:string
):Promise<Chapter[]>{
    const rest = await fetch(
        `https://api.mangadex.org/chapter?manga=${mangaId}&limit=20`
    )

    if(!rest.ok){
        throw new Error(
            "failed to fetch chapters"
        )
    }

    const json = await rest.json()

    return json.data.map((item:any)=>({
        id:item.id,
        chapter:item.attributes.chapter,
        title:item.attributes.title,
        volume:item.attributes.volume,
        translatedLanguage:item.attributes.translatedLanguage,
        pages:item.attributes.pages
    }))
}