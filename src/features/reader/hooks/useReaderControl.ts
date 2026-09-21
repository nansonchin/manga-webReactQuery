import { useCallback, useMemo } from "react";

type UseReaderControlsProps = {
  currentPage: number;
  totalPages: number;
  // scrollToNextPage: () => void;
  // scrollToPreviousPage: () => void;
  // scrollToPage:(page:number)=>void;
  // requestScrollToPage:(page:number)=>void;

  nextChapter: () => void;
  previousChapter: () => void;

  // clickNextPage:()=>void;
  // clickPreviousPage:()=>void;

  nextPage:()=>void;
  previousPage:()=>void;
  goToPage:(page:number)=>void;

};

export function useReaderControls({
  currentPage,
  totalPages,

  // scrollToNextPage,
  // scrollToPreviousPage,
  // scrollToPage,
  // requestScrollToPage,

  nextChapter,
  previousChapter,

  // clickNextPage,
  // clickPreviousPage,
  nextPage,
  previousPage,
  goToPage,

}: UseReaderControlsProps) {

  // const goNextPage = useCallback(()=>{
  //   clickNextPage()
  // },[clickNextPage])

  // const goPreviousPage=useCallback(()=>{
  //   clickPreviousPage()
  // },[clickPreviousPage])

  // const scrollNextPage = useCallback(() => {
  //   scrollToNextPage();
  // }, [scrollToNextPage]);

  // const scrollPreviousPage = useCallback(() => {
  //   scrollToPreviousPage();
  // }, [scrollToPreviousPage]);

  // const goToPreviousChapter = useCallback(() => {
  //   previousChapter();
  // }, [previousChapter]);

  // const goToNextChapter = useCallback(() => {
  //   nextChapter();
  // }, [nextChapter]);

  const next = useCallback(() => {
    const isLastPage = totalPages<=0 || currentPage >= totalPages - 1;

    if (isLastPage) {
      nextChapter();
      return;
    }

    nextPage();
  }, [currentPage, totalPages, nextPage, nextChapter]);

  const previous = useCallback(() => {
    const isFirstPage = currentPage <= 0;

    if (isFirstPage) {
      previousChapter();
      return;
    }

    previousPage();
  }, [currentPage, previousPage, previousChapter]);

  const goToSpecificPage = useCallback((page:number)=>{
    
    if(!Number.isInteger(page)){
      return
    }

    if(page<0 || page>= totalPages){
      return;
    }

    goToPage(page)
  },[goToPage,totalPages])

  // const scrollToSpecificPage = useCallback((page:number)=>{
  //   if(!Number.isInteger(page)){
  //     return
  //   }

  //   if(page<0 || page>=totalPages){
  //     return;
  //   }

  //   requestScrollToPage(page)
  // },[requestScrollToPage,totalPages])

  // const scrollPage = useMemo(
  //   () => ({
  //     next: scrollToNextPage,
  //     previous: scrollToPreviousPage,
  //     goTo:scrollToSpecificPage,
  //   }),
  //   [scrollToNextPage, scrollToPreviousPage, scrollToSpecificPage],
  // );

  // const clickPage = useMemo(
  //   ()=>({
  //     clickNext:clickNextPage,
  //     clickPrevious:clickPreviousPage,
  //     goTo:goToSpecificPage,
  //   }),[clickNextPage,clickPreviousPage,goToSpecificPage]
  // )

  const page = useMemo(()=>({
    next:nextPage,
    previous:previousPage,
    goTo:goToSpecificPage,
  }),[nextPage,previousPage,goToSpecificPage])

  const chapter = useMemo(
    () => ({
      nextChapter,
      previousChapter,
    }),
    [nextChapter, previousChapter],
  );

  return useMemo(
    () => ({
      next,
      previous,
      // scrollPage,
      // clickPage,
      chapter,
      page
    }),
    [next, previous, page, chapter],
  );
}
