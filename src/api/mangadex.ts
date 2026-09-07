import { normalizeManga } from "../features/manga/mapper/mangaMapper";
import type { Manga, MangaDetail } from "../features/manga/types";



export async function fetchMangaList(): Promise<Manga[]> {
  const res = await fetch(
    "https://api.mangadex.org/manga?limit=12&includes[]=cover_art",
  );

  if (!res.ok) {
    throw new Error("failed to fetch manga list");
  }

  const json = await res.json();
  return json.data.map((item: any) => {
    return normalizeManga(item);
  });
}

export async function fetchMangaDetails(id: string) {
  const res = await fetch(
    `https://api.mangadex.org/manga/${id}?includes[]=cover_art`,
  );

  if (!res.ok) {
    throw new Error("failed to fetch manga details");
  }

  const json = await res.json();

  return normalizeManga(json.data);
}
