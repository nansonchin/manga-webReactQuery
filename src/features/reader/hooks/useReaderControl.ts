import { useCallback, useMemo } from "react";

type UseReaderControlsProps = {
  currentPage: number;
  totalPages: number;
  scrollToNextPage: () => void;
  scrollToPreviousPage: () => void;

  nextChapter: () => void;
  previousChapter: () => void;

  clickNextPage:()=>void;
  clickPreviousPage:()=>void;
};

export function useReaderControls({
  currentPage,
  totalPages,
  scrollToNextPage,
  scrollToPreviousPage,
  nextChapter,
  previousChapter,

  clickNextPage,
  clickPreviousPage

}: UseReaderControlsProps) {

  const goNextPage = useCallback(()=>{
    clickNextPage()
  },[])

  const goPreviousPage=useCallback(()=>{
    clickPreviousPage()
  },[])

  const scrollNextPage = useCallback(() => {
    scrollToNextPage();
  }, [scrollToNextPage]);

  const scrollPreviousPage = useCallback(() => {
    scrollToPreviousPage();
  }, [scrollToPreviousPage]);

  const goToPreviousChapter = useCallback(() => {
    previousChapter();
  }, [previousChapter]);

  const goToNextChapter = useCallback(() => {
    nextChapter();
  }, [nextChapter]);

  const next = useCallback(() => {
    const isLastPage = currentPage >= totalPages - 1;

    if (isLastPage) {
      nextChapter();
      return;
    }

    scrollNextPage();
  }, [currentPage, totalPages, scrollNextPage, nextChapter]);

  const previous = useCallback(() => {
    const isFirstPage = currentPage <= 0;

    if (isFirstPage) {
      previousChapter();
      return;
    }

    scrollPreviousPage();
  }, [currentPage, scrollPreviousPage, previousChapter]);

  const scrollPage = useMemo(
    () => ({
      next: scrollNextPage,
      previous: scrollPreviousPage,
    }),
    [scrollNextPage, scrollPreviousPage],
  );

  const clickPage = useMemo(
    ()=>({
      clickNext:goNextPage,
      clickPrevious:goPreviousPage
    }),[goNextPage,goPreviousPage]
  )

  const chapter = useMemo(
    () => ({
      nextChapter: goToNextChapter,
      previousChapter: goToPreviousChapter,
    }),
    [goToNextChapter, goToPreviousChapter],
  );

  return useMemo(
    () => ({
      next,
      previous,
      scrollPage,
      clickPage,
      chapter,
    }),
    [next, previous, scrollPage,clickPage, chapter],
  );
}
