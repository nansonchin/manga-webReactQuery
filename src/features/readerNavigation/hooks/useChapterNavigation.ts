import { useNavigate } from "react-router-dom";
import type { ChapterPage } from "../../reader/types";
import type { ChapterListResponse } from "../../chapter/types";
import type { useInfiniteChapterList } from "../../chapter/hooks/useInfiniteChapterList";
import { useCallback, useEffect, useState } from "react";
import { getChapterNavigation } from "../../../utils/getChapterNavigation";
import type { FetchNextPageOptions } from "@tanstack/react-query";
import type { NavigationStatus } from "../renderNavigation";

type Chapter = ChapterListResponse["items"][number];

// to catch the status when the infinitequeries not yet fetch the next 20 chapter for the next and previous chapter
type PendingNavigation = "previous" | "next" | null;

type FetchNextPage = (options?: FetchNextPageOptions) => Promise<unknown>;

type UseChapterNavigationProps = {
  chapters: Chapter[];
  mangaId: string;
  currentChapterId: string;
  hasMoreChapters: boolean;
  fetchNextPage: FetchNextPage;
  isLoadingMoreChapters: boolean;
  isFetchNextPageError: boolean;
};
export function useChapterNavigation({
  chapters,
  mangaId,
  currentChapterId,
  hasMoreChapters,
  fetchNextPage,
  isLoadingMoreChapters,
  isFetchNextPageError,
}: UseChapterNavigationProps) {
  const navigate = useNavigate();

  // console.log("Chapters[][]", chapters);

  const [pendingNavigation, setPendingNavigation] =
    useState<PendingNavigation>(null);

  const { nextChapter, previousChapter } = getChapterNavigation(
    chapters,
    currentChapterId,
  );

  // chapter sorting [10,9,8]

  const navigateToChapter = useCallback(
    (chapter: Chapter) => {
      navigate(`/manga/${mangaId}/chapter/${chapter.id}`);
    },
    [navigate, mangaId],
  );

  const goNextChapter = useCallback(() => {
    if (!nextChapter) return;
    navigateToChapter(nextChapter);
  }, [nextChapter, navigateToChapter]);

  const goPreviousChapter = useCallback(() => {
    if (previousChapter) {
      navigateToChapter(previousChapter);
      return;
    }

    if (isLoadingMoreChapters || !hasMoreChapters) {
      return;
    }

    setPendingNavigation("previous");
  }, [previousChapter, isLoadingMoreChapters, hasMoreChapters, navigate]);

  useEffect(() => {
    if (pendingNavigation !== "previous") {
      return;
    }

    if (previousChapter) {
      setPendingNavigation(null);
      navigateToChapter(previousChapter);
      return;
    }

    if (isLoadingMoreChapters || isFetchNextPageError) {
      return;
    }

    if (!hasMoreChapters) {
      setPendingNavigation(null);
      return;
    }

    void fetchNextPage();
  }, [
    pendingNavigation,
    previousChapter,
    isLoadingMoreChapters,
    isFetchNextPageError,
    hasMoreChapters,
    fetchNextPage,
    navigateToChapter,
  ]);

  let navigationStatus: NavigationStatus = "idle";

  if (pendingNavigation === "previous") {
    if (isLoadingMoreChapters) {
      navigationStatus = "loading";
    } else if (isFetchNextPageError) {
      navigationStatus = "error";
    }
  }

  return {
    previousChapter,
    nextChapter,
    goPreviousChapter,
    goNextChapter,
    hasPrevious: !!previousChapter || hasMoreChapters,
    hasNext: !!nextChapter,
    pendingNavigation,
    navigationStatus,
  };
}
