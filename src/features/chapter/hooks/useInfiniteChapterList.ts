import { useInfiniteQuery } from "@tanstack/react-query";
import { chapterQueries } from "../queries/chapterQueries";

export function useInfiniteChapterList(mangaId: string) {
  return useInfiniteQuery({
    ...chapterQueries.list(mangaId),
    initialPageParam: 0,
    getNextPageParam(lastPage, pages) {
      const loaded = pages.reduce((sum, page) => sum + page.items.length, 0);
      if (loaded >= lastPage.total) {
        return undefined;
      }
      return pages.length;
    },
  });
}
