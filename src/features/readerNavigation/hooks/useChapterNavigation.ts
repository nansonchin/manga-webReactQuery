import { useNavigate } from "react-router-dom";
import type { ChapterPage } from "../../reader/types";
import type { ChapterListResponse } from "../../chapter/types";
import type { useInfiniteChapterList } from "../../chapter/hooks/useInfiniteChapterList";
import { useEffect, useState } from "react";

type Chapter = ChapterListResponse["items"][number];

type PendingNavigation = "previous" | "next" | null;

export function useChapterNavigation(
  chapters: Chapter[],
  mangaId: string,
  currentChapterId: string,
  hasMoreChapters: boolean,
  loadMoreChapters: () => Promise<void>,
  isLoadingMoreChapters: boolean,
) {
  const navigate = useNavigate();

  const [pendingNavigation, setPendingNavigation] =
    useState<PendingNavigation>(null);

  const currentIndex = chapters.findIndex(
    (chapter) => chapter.id === currentChapterId,
  );
  // chapter sorting [10,9,8]

  const previousChapter =
    currentIndex >= 0 && currentIndex < chapters.length - 1
      ? chapters[currentIndex + 1]
      : null;

  const nextChapter = currentIndex > 0 ? chapters[currentIndex - 1] : null;

  const navigateToChapter = (chapter: Chapter) => {
    navigate(`/manga/${mangaId}/chapter/${chapter.id}`);
  };

  const goPreviousChapter = async () => {
    if(previousChapter){
      navigateToChapter(previousChapter);
      return
    }

    if(isLoadingMoreChapters){
      return;
    }

    if(!hasMoreChapters){
      return
    }

    setPendingNavigation("previous");

    await loadMoreChapters();

    // const newChapters = result.data?.pages.flatMap((page) => page.data ?? []);

    // const newCurrentIndex = newChapters?.findIndex(
    //   (chapter) => chapter.id === currentChapterId,
    // );

  
  };

  const goNextChapter = () => {
    if (!nextChapter) {
      return;
    }

    navigateToChapter(nextChapter)
  };

  useEffect(() => {
    if (!pendingNavigation) {
      return;
    }
    if (isLoadingMoreChapters) {
      return;
    }
    if (pendingNavigation === "previous" && previousChapter) {
      setPendingNavigation(null);
      navigateToChapter(previousChapter);
      return;
    }
    if (!hasMoreChapters) {
      setPendingNavigation(null);
    }
  }, [
    pendingNavigation,
    previousChapter,
    isLoadingMoreChapters,
    hasMoreChapters,
  ]);
  return {
    previousChapter,
    nextChapter,
    goPreviousChapter,
    goNextChapter,
    hasPrevious: !!previousChapter|| hasMoreChapters,
    hasNext: !!nextChapter,
    pendingNavigation,
  };
}
