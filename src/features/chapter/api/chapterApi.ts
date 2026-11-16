import { appendContentRatings } from "../../../api/contentRating";
import type { Chapter, ChapterListResponse } from "../types";

type ChapterDto = {
  id: string;
  attributes: {
    chapter: string | null;
    title: string | null;
    volume: string | null;
    translatedLanguage: string;
    pages: number;
  };
};

type ChapterListDto = {
  data: ChapterDto[];
  total: number;
};
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

  appendContentRatings(params);

  params.set("includeExternalUrl", "0");
  params.set("includeEmptyPages", "0");
  params.set("includeFuturePublishAt", "0");

  const rest = await fetch(
    `https://api.mangadex.org/chapter?${params.toString()}`,
  );

  if (!rest.ok) {
    throw new Error("failed to fetch chapters");
  }

  const json:ChapterListDto = await rest.json();

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
