import { useCallback, useMemo } from "react";

type UseReaderControlsProps = {
  currentPage: number;
  totalPages: number;
  scrollToNextPage: () => void;
  scrollToPreviousPage: () => void;

  nextChapter: () => void;
  previousChapter: () => void;
};

export function useReaderControls({
  currentPage,
  totalPages,
  scrollToNextPage,
  scrollToPreviousPage,
  nextChapter,
  previousChapter,
}: UseReaderControlsProps) {
  const nextPage = useCallback(() => {
    scrollToNextPage();
  }, [scrollToNextPage]);

  const previousPage = useCallback(() => {
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

  const page = useMemo(
    () => ({
      next: nextPage,
      previous: previousPage,
    }),
    [nextPage, previousPage],
  );

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
      page,
      chapter,
    }),
    [next, previous, page, chapter],
  );
}
