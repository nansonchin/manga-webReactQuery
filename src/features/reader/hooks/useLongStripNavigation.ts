import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";


import type {
  Virtualizer,
} from "@tanstack/react-virtual";


type UseLongStripNavigationProps = {
  currentPage: number;
  totalPages: number;
  virtualizer: Virtualizer<
    HTMLElement,
    Element
  >;

  onPageChange: (
    page: number
  ) => void;

  setProgrammaticNavigation?: (
    value: boolean
  ) => void;
};


export function useLongStripNavigation({
  currentPage,
  totalPages,
  virtualizer,
  onPageChange,
  setProgrammaticNavigation,
}: UseLongStripNavigationProps) {
  const [
    targetPage,
    setTargetPage,
  ] = useState<number | null>(
    null
  );


  const currentPageRef =
    useRef(currentPage);

  useEffect(() => {
    currentPageRef.current =
      currentPage;
  }, [currentPage]);

  const unlockTimerRef =
    useRef<number | null>(null);

  const clampPage = useCallback(
    (page: number) => {
      if (totalPages <= 0) {
        return 0;
      }


      return Math.min(
        Math.max(
          page,
          0
        ),
        totalPages - 1
      );
    },
    [totalPages]
  );

  const clearUnlockTimer =
    useCallback(() => {
      if (
        unlockTimerRef.current !==
        null
      ) {
        window.clearTimeout(
          unlockTimerRef.current
        );


        unlockTimerRef.current =
          null;
      }
    }, []);

  const startProgrammaticNavigation =
    useCallback(() => {
      clearUnlockTimer();

      setProgrammaticNavigation?.(
        true
      );

      const unlock =
        () => {
          unlockTimerRef.current =
            null;


          setProgrammaticNavigation?.(
            false
          );
        };


      unlockTimerRef.current =
        window.setTimeout(
          unlock,
          180
        );
    }, [
      clearUnlockTimer,
      setProgrammaticNavigation,
    ]);

  const requestScrollToPage =
    useCallback(
      (page: number) => {
        if (
          totalPages <= 0
        ) {
          return;
        }


        const safePage =
          clampPage(page);

        if (
          safePage ===
          currentPageRef.current
        ) {
          return;
        }

        currentPageRef.current =
          safePage;


        setTargetPage(
          safePage
        );

        startProgrammaticNavigation();

        virtualizer.scrollToIndex(
          safePage,
          {
            align: "start",
            behavior: "auto",
          }
        );

        onPageChange(
          safePage
        );

        setTargetPage(null);
      },
      [
        clampPage,
        onPageChange,
        startProgrammaticNavigation,
        totalPages,
        virtualizer,
      ]
    );

  const scrollToNextPage =
    useCallback(() => {
      if (
        totalPages <= 0
      ) {
        return;
      }


      const page =
        currentPageRef.current;


      if (
        page >=
        totalPages - 1
      ) {
        return;
      }


      requestScrollToPage(
        page + 1
      );
    }, [
      requestScrollToPage,
      totalPages,
    ]);

  const scrollToPreviousPage =
    useCallback(() => {
      if (
        totalPages <= 0
      ) {
        return;
      }


      const page =
        currentPageRef.current;


      if (page <= 0) {
        return;
      }


      requestScrollToPage(
        page - 1
      );
    }, [
      requestScrollToPage,
      totalPages,
    ]);

  useEffect(() => {
    return () => {
      clearUnlockTimer();


      setProgrammaticNavigation?.(
        false
      );
    };
  }, [
    clearUnlockTimer,
    setProgrammaticNavigation,
  ]);


  return {
    targetPage,
    requestScrollToPage,
    scrollToNextPage,
    scrollToPreviousPage,
  };
}





