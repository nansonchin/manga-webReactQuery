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


  type FetchNextPage =(options?:FetchNextPageOptions)=> Promise<unknown>

export function useChapterNavigation(
  chapters: Chapter[],
  mangaId: string,
  currentChapterId: string,
  hasMoreChapters: boolean,
  fetchNextPage:FetchNextPage,
  isLoadingMoreChapters: boolean,
  isFetchNextPageError:boolean,
) {
  const navigate = useNavigate();

  console.log("Chapters[][]",chapters)
  
  const [pendingNavigation, setPendingNavigation] =
    useState<PendingNavigation>(null);

    const {nextChapter,previousChapter}= getChapterNavigation(chapters,currentChapterId)

  // chapter sorting [10,9,8]

  const navigateToChapter = (chapter: Chapter) => {
    navigate(`/manga/${mangaId}/chapter/${chapter.id}`);
  };

  const goPreviousChapter = useCallback( () => {
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
  },[previousChapter, isLoadingMoreChapters,hasMoreChapters,navigate]);

  const goNextChapter = useCallback(() => {
    if (!nextChapter) {
      return;
    }

    navigateToChapter(nextChapter);
  },[nextChapter,navigateToChapter]);

  const needsMoreChapters = pendingNavigation === "previous" && !previousChapter && hasMoreChapters;

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

  useEffect(()=>{
    if(pendingNavigation !=="previous"){
      return;
    }

    if(previousChapter){
      return
    }

    if(!hasMoreChapters){
      setPendingNavigation(null)
      return
    }

    if(isLoadingMoreChapters){
      return
    }

    if(isFetchNextPageError){
      return
    }

    void fetchNextPage()
  },[pendingNavigation, previousChapter,hasMoreChapters,isLoadingMoreChapters,isFetchNextPageError,fetchNextPage])

  useEffect(()=>{
    if(pendingNavigation!=="previous"){
      return;
    }
    if(!previousChapter){
      return;
    }

    setPendingNavigation(null);
    navigateToChapter(previousChapter)
  },[pendingNavigation,previousChapter])

  let navigationStatus :NavigationStatus ="idle";

  if(pendingNavigation ==="previous"){
    if(isLoadingMoreChapters){
      navigationStatus="loading"
    }else if (isFetchNextPageError){
      navigationStatus="error"
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
    needsMoreChapters
  };
}
