export type Manga={
    id:string,
    title:string,
    description:string,
    coverUrl:string|null
}

export type MangaDetail = Manga &{
    status: string|null
}