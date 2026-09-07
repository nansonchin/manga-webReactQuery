import type { MangaDetail } from "../types";

export function normalizeManga(item: any): MangaDetail {
  const titleObj = item.attributes?.title ?? {};

  const descObj = item.attributes?.description ?? {};

  const title = titleObj.en || Object.values(titleObj)[0] || "No title";

  const description =
    descObj.en || Object.values(descObj)[0] || "No description";

  const cover = item.relationships?.find(
    (rel: any) => rel.type === "cover_art",
  );

  const coverUrl = cover
    ? `https://uploads.mangadex.org/covers/${item.id}/${cover.attributes.fileName}`
    : null;

  return {
    id: item.id,
    title,
    description,
    coverUrl,
  };
}