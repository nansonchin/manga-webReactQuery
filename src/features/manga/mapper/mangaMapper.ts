import type { mangaDto } from "../dto/mangaDto";
import type { MangaDetail } from "../types";

export function normalizeManga(item: mangaDto): MangaDetail {
  const titleObj = item.attributes?.title ?? {};

  const descObj = item.attributes?.description ?? {};

  const title = titleObj.en || Object.values(titleObj)[0] || "No title";

  const description =
    descObj.en || Object.values(descObj)[0] || "No description";

  const cover = item.relationships?.find(
    (rel) => rel.type === "cover_art",
  );

  const fileName = cover?.attributes?.fileName;

  const coverUrl = fileName
    ? `https://uploads.mangadex.org/covers/${item.id}/${fileName}`
    : null;

  const coverSmallUrl = fileName ? `${coverUrl}.256.jpg` : null;

  const coverLargeUrl = fileName ? `${coverUrl}.512.jpg` : null;

  const author = item.relationships?.filter((rel)=>rel.type ==="author").map((rel)=>rel.attributes?.name).filter((name):name is string =>Boolean(name)) ?? []

  const artist =
    item.relationships
      ?.filter((rel) => rel.type === "artist")
      .map((rel) => rel.attributes?.name)
      .filter((name):name is string => Boolean(name))??[]

  const tags= item.attributes?.tags?.map((tag)=>
    tag.attributes?.name?.en
  ).filter((tag):tag is string =>Boolean(tag)) ?? []

  const year = item.attributes?.year??null;

  return {
    id: item.id,
    title,
    description,
    coverUrl,
    status: item.attributes?.status ?? null,
    coverLargeUrl,
    coverSmallUrl,
    author,
    artist,
    tags,
    year
  };
}
