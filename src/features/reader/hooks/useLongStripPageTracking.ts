import { useCallback, useEffect, useRef } from "react";

type UseLongStripPageTrackingProps = {
  enabled: boolean;

  root: HTMLElement | null;

  onPageChange: (page: number) => void;
};

export function useLongStripPageTracking({
  enabled,
  root,
  onPageChange,
}: UseLongStripPageTrackingProps) {
  const observerRef = useRef<IntersectionObserver | null>(null);

  const lastPageRef = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    if (!root) {
      return;
    }

    observerRef.current?.disconnect();

    lastPageRef.current = null;

    const observer = new IntersectionObserver(
      (entries) => {
        const visiblePages = entries
          .filter((entry) => entry.isIntersecting)
          .map((entry) => {
            const page = Number(entry.target.getAttribute("data-page"));

            const rect = entry.target.getBoundingClientRect();

            const pageCenter = rect.top + rect.height / 2;

            return {
              page: page - 1,

              pageCenter,
            };
          });

        if (visiblePages.length === 0) {
          return;
        }

        const rootRect = root.getBoundingClientRect();

        const viewportCenter = rootRect.top + rootRect.height / 2;

        visiblePages.sort((a, b) => {
          return (
            Math.abs(a.pageCenter - viewportCenter) -
            Math.abs(b.pageCenter - viewportCenter)
          );
        });

        const currentPage = visiblePages[0].page;

        if (lastPageRef.current === currentPage) {
          return;
        }

        lastPageRef.current = currentPage;

        onPageChange(currentPage);
      },
      {
        root,

        threshold: 0,

        rootMargin: "-40% 0px -40% 0px",
      },
    );

    observerRef.current = observer;

    const elements = root.querySelectorAll<HTMLElement>("[data-page]");

    elements.forEach((element) => {
      observer.observe(element);
    });

    /**
     * cleanup。
     */
    return () => {
      observer.disconnect();

      observerRef.current = null;

      lastPageRef.current = null;
    };
  }, [enabled, root, onPageChange]);

  const observePage = useCallback(
    (element: HTMLElement | null) => {
      if (!element) {
        return;
      }

      if (!enabled) {
        return;
      }

      observerRef.current?.observe(element);
    },
    [enabled],
  );

  return {
    observePage,
  };
}
