import { useEffect } from "react";

type ReaderControls = {
  next: () => void;
  previous: () => void;
  page: {
    next: () => void;
    previous: () => void;
  };
  chapter: {
    nextChapter: () => void;
    previousChapter: () => void;
  };
};

type UseKeyboardNavigationProps = {
  controls: ReaderControls;
};

export function useKeyboardNavigation({
  controls,
}: UseKeyboardNavigationProps) {
  useEffect(() => {
    const handlerKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case "ArrowRight":
          event.preventDefault();
          console.log("clicked")
          controls.chapter.nextChapter();
          break;

        case "ArrowLeft":
          event.preventDefault();
          controls.chapter.previousChapter();
          break;

        case "ArrowDown":
          event.preventDefault();
          controls.next();
          break;

        case "ArrowUp":
          event.preventDefault();
          controls.previous();
          break;

        default:
          break;
      }
    };

    window.addEventListener("keydown", handlerKeyDown);

    return () => {
      window.removeEventListener("keydown", handlerKeyDown);
    };
  }, [controls]);
}
