export type ChapterPagesResponse={
    baseUrl:string;
    chapter:{
        hash:string;
        data:string[];
        dataSaver:string[]
    }
}

export async function fetchChapterPages(
    chapterId:string
):Promise<ChapterPagesResponse>{
    const res = await fetch(
        `https://api.mangadex.org/at-home/server/${chapterId}`
    )


    if(!res.ok){
        throw new Error(

            "failed to fetch chapter pages"
        )
    }

    return res.json()
}