import { useCallback, useMemo } from "react";

type UseReaderControlsProps = {
  currentPage: number;
  totalPages: number;
  scrollToNextPage: () => void;
  scrollToPreviousPage: () => void;
  scrollToPage:(page:number)=>void;

  nextChapter: () => void;
  previousChapter: () => void;

  clickNextPage:()=>void;
  clickPreviousPage:()=>void;
  goToPage:(page:number)=>void;
};

export function useReaderControls({
  currentPage,
  totalPages,

  scrollToNextPage,
  scrollToPreviousPage,
  scrollToPage,

  nextChapter,
  previousChapter,

  clickNextPage,
  clickPreviousPage,
  goToPage,

}: UseReaderControlsProps) {

  const goNextPage = useCallback(()=>{
    clickNextPage()
  },[clickNextPage])

  const goPreviousPage=useCallback(()=>{
    clickPreviousPage()
  },[clickPreviousPage])

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

  const goToSpecificPage = useCallback((page:number)=>{
    if(page<0){
      return;
    }

    if(page>=totalPages){
      return;
    }

    goToPage(page)
  },[goToPage,totalPages])

  const scrollToSpecificPage = useCallback((page:number)=>{
    if(page<0){
      return;
    }

    if(page>=totalPages){
      return;
    }

    scrollToPage(page)
  },[scrollToPage,totalPages])

  const scrollPage = useMemo(
    () => ({
      next: scrollNextPage,
      previous: scrollPreviousPage,
      goTo:scrollToSpecificPage,
    }),
    [scrollNextPage, scrollPreviousPage, scrollToSpecificPage],
  );

  const clickPage = useMemo(
    ()=>({
      clickNext:goNextPage,
      clickPrevious:goPreviousPage,
      goTo:goToSpecificPage,
    }),[goNextPage,goPreviousPage,goToSpecificPage]
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
