import { useEffect } from "react";

type ReaderControls = {
  next: () => void;
  previous: () => void;
};

type UseKeyboardNavigationProps = {
  controls: ReaderControls;
  enabled?: boolean;
  verticalArrowsNavigate?: boolean;
};

function isTypingTarget(target: EventTarget | null): boolean {
  return (
    target instanceof HTMLInputElement ||
    target instanceof HTMLTextAreaElement ||
    target instanceof HTMLSelectElement ||
    (target instanceof HTMLElement && target.isContentEditable)
  );
}

export function useKeyboardNavigation({
  controls,
  enabled = true,
  verticalArrowsNavigate = true,
}: UseKeyboardNavigationProps) {
  useEffect(() => {
    if (!enabled) {
      return;
    }
    const handlerKeyDown = (event: KeyboardEvent) => {
      if (isTypingTarget(event.target)) {
        return;
      }

      if (event.ctrlKey || event.metaKey || event.altKey) {
        return;
      }

      switch (event.key) {
        case "ArrowRight": {
          event.preventDefault();
          controls.next();
          break;
        }
        case "ArrowLeft": {
          event.preventDefault();
          controls.previous();
          break;
        }

        case "ArrowDown": {
          if (verticalArrowsNavigate) {
            event.preventDefault();
            controls.next();
          }
          break;
        }
        case "ArrowUp": {
          if (verticalArrowsNavigate) {
            event.preventDefault();
            controls.previous();
          }
          break;
        }

        default:
          break;
      }
    };

    window.addEventListener("keydown", handlerKeyDown);

    return () => {
      window.removeEventListener("keydown", handlerKeyDown);
    };
  }, [controls,enabled ,verticalArrowsNavigate]);
}
