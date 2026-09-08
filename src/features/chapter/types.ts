export type Chapter ={
    id:string
    chapter:string | null
    title:string|null
    volume:string|null
    translatedLanguage:string

    pages:number
}

export type ChapterListResponse ={
    items:Chapter[],
    total:number;
}