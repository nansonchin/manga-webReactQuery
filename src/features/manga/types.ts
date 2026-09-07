export type Manga={
    id:string,
    title:string,
    description:string,
    coverUrl:string|null
    coverSmallUrl:string|null
    coverLargeUrl:string|null
}

export type MangaDetail = Manga &{
    status: string|null
    author:string[]
    artist:string[]
    tags:string[]
    year:number|null
}