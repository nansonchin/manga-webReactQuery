import { useCallback, useEffect, useRef, useState } from "react";

 type useCurrentReaderPageProps={
  totalPages: number;
 }

export function useCurrentReaderPage({totalPages}:useCurrentReaderPageProps) {
    // to store the current page that showing out to the user device.
    // example: user is currently on page10 image
  const [currentPage, setCurrentPage] = useState(0);

  const visiblePages = useRef(new Map<Element, number>());

  const observerRef = useRef<IntersectionObserver | null>(null);

  const pageElements = useRef(new Set<HTMLElement>())

  // page that the long strip page need to jump to when the dom is not ready for the page rendering
  const [targetPage,setTargetPage] = useState<number|null>(null);

  const clampPage = useCallback((page:number)=>{
    if(totalPages<=0){
      return 0;
    }

    return  Math.min(Math.max(page,0),totalPages-1)
  },[totalPages])

// observe and update the current page
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const page = Number(entry.target.getAttribute("data-page"));

          if (entry.isIntersecting) {
            visiblePages.current.set(entry.target, page);
          } else {
            visiblePages.current.delete(entry.target);
          }
        });

        const viewportCenter = window.innerHeight / 2;

        const current = [...visiblePages.current.entries()].sort(([a], [b]) => {
          const aRect = a.getBoundingClientRect();

          const bRect = b.getBoundingClientRect();

          const aCenter = aRect.top + aRect.height / 2;

          const bCenter = bRect.top + bRect.height / 2;

          return (
            Math.abs(aCenter - viewportCenter) -
            Math.abs(bCenter - viewportCenter)
          );
        })[0];

        if (current) {
          setCurrentPage(current[1] - 1);
        }
      },
      {
         threshold:0,
    rootMargin:"-40% 0px -40% 0px"
      },
    );

    observerRef.current = observer;

    pageElements.current.forEach((element)=>{
      observer.observe(element)
    })

    return () => {
      observer.disconnect();
      observerRef.current=null;
      visiblePages.current.clear()
    };
  }, []);

  // register page Dom element to IntersectionnObserver
  const observePage = useCallback((element: HTMLElement | null) => {
    if(!element){
      return
    }
    if (element) {
      observerRef.current?.observe(element);
      pageElements.current.add(element)
    }
  }, []);


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

  
  const requestScrollToPage = useCallback((page:number)=>{
    if(totalPages<=0){
      return
    }
    const safefPage = clampPage(page)
    setTargetPage(page)
  },[clampPage,totalPages])

  useEffect(()=>{
    if(targetPage === null){
      return;
    }

    const element = document.querySelector(
      `[data-page="${targetPage+1}"]`
    )

    if(!element){
      return;
    }

    element.scrollIntoView({

      behavior:"smooth",
      block:"start"
    })

    setTargetPage(null)
  },[targetPage])

  const scrollToNextPage = useCallback(()=>{
    if(currentPage>=totalPages-1){
      return;
    }

    requestScrollToPage(currentPage+1)
  },[currentPage,requestScrollToPage])

  const scrollToPreviousPage = useCallback(()=>{
    if(currentPage<=0){
      return
    };

    requestScrollToPage(currentPage-1)
  },[currentPage,requestScrollToPage])


  // single page

  const goToNextPage = useCallback(()=>{
    setCurrentPage((page)=>{
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
    observePage,
    // long strip page
    targetPage,
    scrollToNextPage,
    scrollToPreviousPage,
    // scrollToPage,
    requestScrollToPage,

    // clicke /tap single page
    goToNextPage,
    goToPreviousPage,
    goToPage
  };
}
