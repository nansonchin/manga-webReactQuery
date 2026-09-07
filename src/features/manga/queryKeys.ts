export const mangaKeys={
    all:["manga"] as const,
    lists:()=>[
        ...mangaKeys.all,
        "list"
    ]as const,

    list:()=>[
        ...mangaKeys.lists()
    ] as const,

    details:()=>[
        ...mangaKeys.all,
        "detail"
    ] as const,

    detail: (id:string)=>[
        ...mangaKeys.details(),
        id
    ] as const
}