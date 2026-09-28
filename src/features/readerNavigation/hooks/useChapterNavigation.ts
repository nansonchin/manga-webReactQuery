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

  console.log("Chapters[][]", chapters);

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

  const goPreviousChapter = useCallback(() => {
    if (previousChapter) {
      navigateToChapter(previousChapter);
      return;
    }

    if (isLoadingMoreChapters) {
      return;
    }

    if (!hasMoreChapters) {
      return;
    }

    setPendingNavigation("previous");

    // try {
    //   await loadMoreChapters();
    // } catch (error) {
    //   console.error("Failed to load previous chapter", error);
    // setPendingNavigation(null);
    // }
    // const newChapters = result.data?.pages.flatMap((page) => page.data ?? []);

    // const newCurrentIndex = newChapters?.findIndex(
    //   (chapter) => chapter.id === currentChapterId,
    // );
  }, [previousChapter, isLoadingMoreChapters, hasMoreChapters, navigate]);

  const goNextChapter = useCallback(() => {
    if (!nextChapter) {
      return;
    }

    if (nextChapter) {
      navigateToChapter(nextChapter);
    }

    if (isLoadingMoreChapters) {
      return;
    }

    if (!hasMoreChapters) {
      return;
    }

    setPendingNavigation("next");
  }, [nextChapter, navigateToChapter]);

  const needsMoreChapters =
    !!pendingNavigation && !previousChapter && !nextChapter && hasMoreChapters

  // useEffect(() => {
  //   if (!pendingNavigation) {
  //     return;
  //   }

  //   if(pendingNavigation!=="previous"){
  //     return;
  //   }

  //   if (isLoadingMoreChapters) {
  //     return;
  //   }

  //   if(isFetchNextPageError){
  //     return;
  //   }

  //   if (pendingNavigation === "previous" && previousChapter) {
  //     setPendingNavigation(null);
  //     navigateToChapter(previousChapter);
  //     return;
  //   }
  //   if (!hasMoreChapters) {
  //     setPendingNavigation(null);
  //   }
  // }, [
  //   pendingNavigation,
  //   previousChapter,
  //   isLoadingMoreChapters,
  //   hasMoreChapters,
  //   isFetchNextPageError
  // ]);

  useEffect(() => {
    if (!pendingNavigation) {
      return;
    }

    if (isLoadingMoreChapters) {
      return;
    }
    if (isFetchNextPageError) {
      return;
    }

    const targetChapter =
      pendingNavigation === "previous" ? previousChapter : nextChapter;

    if (targetChapter) {
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
    nextChapter,
    hasMoreChapters,
    isLoadingMoreChapters,
    isFetchNextPageError,
    fetchNextPage,
  ]);

  useEffect(() => {
    if (!pendingNavigation) {
      return;
    }
    const targetChapter = pendingNavigation === "previous" ? previousChapter:nextChapter

    if(!targetChapter){
      return;
    }


    setPendingNavigation(null);
    navigateToChapter(targetChapter);
  }, [pendingNavigation, previousChapter]);

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
    hasNext: !!nextChapter || hasMoreChapters,
    pendingNavigation,
    navigationStatus,
    needsMoreChapters,
  };
}
