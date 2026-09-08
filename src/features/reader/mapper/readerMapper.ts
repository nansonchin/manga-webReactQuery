import type { ChapterPagesResponse } from "../api/renderApi";
import type { ChapterPage } from "../types";

export function normalizeChapterPages(
    data:ChapterPagesResponse
):ChapterPage[]{
    return data.chapter.data.map(
        (file,index)=>({
            index,
            url: `${data.baseUrl}/data/${data.chapter.hash}/${file}`
        })
    )
}