import { use, useCallback, useEffect, useRef, useState } from "react";

export function useCurrentReaderPage() {
    // to store the current page that showing out to the user device.
    // example: user is currently on page10 image
  const [currentPage, setCurrentPage] = useState(0);

  const visiblePages = useRef(new Map<Element, number>());

  const observerRef = useRef<IntersectionObserver | null>(null);

  const pageElements = useRef(new Set<HTMLElement>())

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

  const observePage = useCallback((element: HTMLElement | null) => {
    if(!element){
      return
    }
    if (element) {
      observerRef.current?.observe(element);
      pageElements.current.add(element)
    }
  }, []);

  const scrollToPage = useCallback((page:number)=>{
    const element = document.querySelector(
      `[data-page="${page+1}"]`
    )

    if(!element){
      return
    }

    element.scrollIntoView({
      behavior:"smooth",
      block:"start"
    })
  },[])

  const scrollToNextPage = useCallback(()=>{
    scrollToPage(currentPage+1)
  },[currentPage,scrollToPage])

  const scrollToPreviousPage = useCallback(()=>{
    if(currentPage<=0){
      return 0
    };

    scrollToPage(currentPage-1)
  },[currentPage,scrollToPage])


  return {
    currentPage,
    observePage,
    scrollToNextPage,
    scrollToPreviousPage,
    scrollToPage,
  };
}
