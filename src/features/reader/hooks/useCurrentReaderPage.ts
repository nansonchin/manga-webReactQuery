import { useCallback, useEffect, useRef, useState } from "react";

 type useCurrentReaderPageProps={
  totalPages: number;
 }

export function useCurrentReaderPage({totalPages}:useCurrentReaderPageProps) {
    // to store the current page that showing out to the user device.
    // example: user is currently on page10 image
  const [currentPage, setCurrentPage] = useState(0);


  // page that the long strip page need to jump to when the dom is not ready for the page rendering
  // const [targetPage,setTargetPage] = useState<number|null>(null);

  const clampPage = useCallback((page:number)=>{
    if(totalPages<=0){
      return 0;
    }

    return  Math.min(Math.max(page,0),totalPages-1)
  },[totalPages])

  useEffect(()=>{
    setCurrentPage((page)=>clampPage(page))
  },[clampPage])

  const setCurrentPageFromTracking = useCallback((page:number)=>{
    if(!Number.isInteger(page)){
      return;
    }

    if(totalPages<=0){
      return;
    }

    if(page<0 || page>= totalPages){
      return;
    }

    setCurrentPage(page)
  },[totalPages])
  

  //long - strip page
  // const scrollToPage = useCallback((page:number)=>{
  //   const element = document.querySelector(
  //     `[data-page="${page+1}"]`
  //   )

  //   if(!element){
  //     return
  //   }

  //   element.scrollIntoView({
  //     behavior:"smooth",
  //     block:"start"
  //   })
  // },[])

  
  // const requestScrollToPage = useCallback((page:number)=>{
  //   if(totalPages<=0){
  //     return
  //   }
  //   const safePage = clampPage(page)
  //   setTargetPage(safePage)
  // },[clampPage,totalPages])

  // useEffect(()=>{
  //   if(targetPage === null){
  //     return;
  //   }

  //   const element = document.querySelector(
  //     `[data-page="${targetPage+1}"]`
  //   )

  //   if(!element){
  //     return;
  //   }

  //   element.scrollIntoView({

  //     behavior:"smooth",
  //     block:"start"
  //   })

  //   setTargetPage(null)
  // },[targetPage])

  // const scrollToNextPage = useCallback(()=>{
  //   if(totalPages<=0){
  //     return
  //   }
  //   if(currentPage>=totalPages-1){
  //     return;
  //   }

  //   requestScrollToPage(currentPage+1)
  // },[currentPage,requestScrollToPage])

  // const scrollToPreviousPage = useCallback(()=>{
  //   if(currentPage<=0){
  //     return
  //   };

  //   requestScrollToPage(currentPage-1)
  // },[currentPage,requestScrollToPage])


  // single page

  const goToNextPage = useCallback(()=>{
    setCurrentPage((page)=>{
      if(totalPages <=0){
        return 0
      }
      if(page>=totalPages-1){
       return page;
      }

      return page +1
    })
  },[totalPages])

  const goToPreviousPage = useCallback(()=>{
    setCurrentPage((page)=>Math.max(0,page-1))
  },[])

  const goToPage = useCallback((page:number)=>{
    if(!Number.isInteger(page)){
      return;
    }

    if(page<0 || page >= totalPages){
      return;
    }
    setCurrentPage(page);
  },[totalPages])


  return {
    currentPage,
    setCurrentPageFromTracking,
    // observePage,
    // long strip page
    // targetPage,
    // scrollToNextPage,
    // scrollToPreviousPage,
    // scrollToPage,
    // requestScrollToPage,

    // clicke /tap single page
    goToNextPage,
    goToPreviousPage,
    goToPage
  };
}
