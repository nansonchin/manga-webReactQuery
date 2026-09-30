import { useCallback, useEffect, useRef } from "react";

type UseLongStripPageTrackingProps = {
    enabled:boolean;
    root:HTMLElement|null
  onPageChange: (page: number) => void;
};

export function useLongStripPageTracking({
    enabled,
    root,
  onPageChange,
}: UseLongStripPageTrackingProps) {
  const visiblePages = useRef(new Map<Element, number>());
  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastPageRef = useRef<number|null>(null)
  const pageElements = useRef(new Set<HTMLElement>());

  // observe and update the current page
  useEffect(() => {
    if(!enabled){
        return
    }
    if(!root){
      return
    }
    
    observerRef.current?.disconnect()
  visiblePages.current.clear()
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const page = Number(entry.target.getAttribute("data-page"));

          if(!Number.isInteger(page)){
            return
          }

          if (entry.isIntersecting) {
            visiblePages.current.set(entry.target, page);
          } else {
            visiblePages.current.delete(entry.target);
          }
        });

        if(visiblePages.current.size===0){
          return
        }

        const rootRect = root.getBoundingClientRect()

        const viewportCenter = rootRect.top + rootRect.height/ 2;

        let closestPage:number |null = null;
        let closestDistance = Infinity

        visiblePages.current.forEach(
          (page,element)=>{
            const rect = element.getBoundingClientRect()
            const pageCenter = rect.top + rect.height/2

            const distance = Math.abs(
              pageCenter - viewportCenter
            )

            if(distance < closestDistance){
              closestDistance=distance;
              closestPage=page
            }
          }
        )

        if(closestPage === null){
          return
        }

        const currentPage = closestPage -1 

        if(lastPageRef.current === currentPage){
          return
        }

        lastPageRef.current = currentPage
        // const current = [...visiblePages.current.entries()].sort(([a], [b]) => {
        //   const aRect = a.getBoundingClientRect();

        //   const bRect = b.getBoundingClientRect();

        //   const aCenter = aRect.top + aRect.height / 2;

        //   const bCenter = bRect.top + bRect.height / 2;

        //   return (
        //     Math.abs(aCenter - viewportCenter) -
        //     Math.abs(bCenter - viewportCenter)
        //   );
        // })[0];

        // if (!current) {
        //   return;
        // }
        // const page = current[1] - 1;
        onPageChange(currentPage);
      },
      {
        root,
        threshold: 0,
        rootMargin: "-40% 0px -40% 0px",
      },
    );

    observerRef.current = observer;

    pageElements.current.forEach((element) => {
      observer.observe(element);
    });

    return () => {
      observer.disconnect();
      observerRef.current = null;
      visiblePages.current.clear();
    };
  }, [enabled, onPageChange,root]);

  // register page Dom element to IntersectionnObserver
  const observePage = useCallback((element: HTMLElement | null) => {
    if (!element) {
      return;
    }
      pageElements.current.add(element);

    if (enabled) {
      observerRef.current?.observe(element);
    }
  }, [enabled]);

  return {
    observePage,
  };
}
