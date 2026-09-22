import { useCallback, useEffect, useRef } from "react";

type UseLongStripPageTrackingProps = {
    enabled:boolean;
  onPageChange: (page: number) => void;
};

export function useLongStripPageTracking({
    enabled,
  onPageChange,
}: UseLongStripPageTrackingProps) {
  const visiblePages = useRef(new Map<Element, number>());
  const observerRef = useRef<IntersectionObserver | null>(null);

  const pageElements = useRef(new Set<HTMLElement>());

  // observe and update the current page
  useEffect(() => {
    if(!enabled){
        return
    }
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

        if (!current) {
          return;
        }
        const page = current[1] - 1;
        onPageChange(page);
      },
      {
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
  }, [enabled, onPageChange]);
  // register page Dom element to IntersectionnObserver
  const observePage = useCallback((element: HTMLElement | null) => {
    if (!element) {
      return;
    }

    if (enabled) {
      observerRef.current?.observe(element);
    }
      pageElements.current.add(element);
  }, [enabled]);

  return {
    observePage,
  };
}
