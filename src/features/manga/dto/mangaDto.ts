export type MangaRelationshipDto ={
    id:string
    type:string
    attributes?:{
        name?:string
        fileName?:string
    }
}

export type mangaDto ={
    id:string
    attributes:{
        title:Record<string,string>
        description:Record<string,string>
        status:string,
        year:number|null
        tags:{
            attributes:{
                name:{
                    en:string
                }
            }
        }[]
    }
    relationships:MangaRelationshipDto[]
}

export type MangaListResponseDto={
    result:string
    response:string
    data:mangaDto[]
    limit:number
    offset:number
    total:number
}

export type MangaDetailResponseDto={
    result:string
    response:string
    data:mangaDto
}