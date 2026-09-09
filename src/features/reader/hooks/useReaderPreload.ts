import { useEffect, useRef } from "react";
import type { ChapterPage } from "../types";
import { preloadImage } from "../../utils/imagePreloader";

export function useReaderPreload(
  pages: ChapterPage[],
  currentPage: number,
  preloadCount: number = 3,
) {
    // get the currentpage that the user is reading now to prefetch the next 3 pages and store into cache.
  // const loadedImages = useRef(new Set<string>());
  useEffect(() => {
    if (!pages.length ||preloadCount<=0) {
      return;
    }

    const start = currentPage + 1;

    const end = start + preloadCount;

    const nextPages = pages.slice(start, end);

    nextPages.forEach((page) => {
      // if (loadedImages.current.has(page.url)) {
      //   return;
      // }

      void preloadImage(page.url);

      // loadedImages.current.add(page.url);
      console.log("preload", page.url);
      console.log(currentPage,nextPages.map(p=>p.index))
    });
  }, [pages, currentPage, preloadCount]);
}
