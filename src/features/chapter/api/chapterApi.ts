import type { Chapter, ChapterListResponse } from "../types";

export async function fetchChapterList(
  mangaId: string,
  page: number = 0,
  limit: number = 20,
): Promise<ChapterListResponse> {
  const offset = page * limit;
  const params = new URLSearchParams();

  params.set("manga", mangaId);
  params.set("limit", limit.toString());
  params.set("offset", offset.toString());
  params.append("translatedLanguage[]", "en");
  params.append("order[chapter]", "desc");

  const rest = await fetch(
    `https://api.mangadex.org/chapter?${params.toString()}`,
  );

  if (!rest.ok) {
    throw new Error("failed to fetch chapters");
  }

  const json = await rest.json();

  return {
    items: json.data.map((item: any) => ({
      id: item.id,
      chapter: item.attributes.chapter,
      title: item.attributes.title,
      volume: item.attributes.volume,
      translatedLanguage: item.attributes.translatedLanguage,
      pages: item.attributes.pages,
    })),
    total: json.total,
  };
}
