import type { MangaDetailResponseDto, mangaDto, MangaListResponseDto } from "../features/manga/dto/mangaDto";
import { normalizeManga } from "../features/manga/mapper/mangaMapper";
import type { Manga, MangaDetail, MangaListResult } from "../features/manga/types";



export async function fetchMangaList(
  page:number=0,
  limit:number=12
): Promise<MangaListResult> {
  const offset = page * limit;
  const res = await fetch(
    `https://api.mangadex.org/manga?limit=${limit}&offset=${offset}&includes[]=cover_art`,
  );

  if (!res.ok) {
    throw new Error("failed to fetch manga list");
  }

  const json:MangaListResponseDto = await res.json();
  return {
    items:json.data.map((item:mangaDto)=>normalizeManga(item)),
    total:json.total
  }
}

export async function fetchMangaDetails(id: string) {
  const res = await fetch(
    `https://api.mangadex.org/manga/${id}?includes[]=cover_art&includes[]=author&includes[]=artist&order[createdAt]=desc`,
  );

  if (!res.ok) {
    throw new Error("failed to fetch manga details");
  }

  const json:MangaDetailResponseDto = await res.json();

  return normalizeManga(json.data);
}
