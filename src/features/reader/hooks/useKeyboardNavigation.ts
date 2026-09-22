import { useEffect } from "react";

type ReaderControls = {
  next: () => void;
  previous: () => void;
  
};

type UseKeyboardNavigationProps = {
  controls: ReaderControls;
  enabled?:boolean;
};

export function useKeyboardNavigation({
  controls,
  enabled=true,
}: UseKeyboardNavigationProps) {
  useEffect(() => {
    if(!enabled){
      return
    }
    const handlerKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement |null;
      if(target instanceof HTMLInputElement 
        || target instanceof HTMLTextAreaElement 
        || target instanceof HTMLSelectElement
        || target?.isContentEditable
      ){
        return;
      }

      switch(event.key){
        case "ArrowRight":
          case "ArrowDown":{
            event.preventDefault();
            controls.next();
            break;
          }

          case "ArrowLeft": case "ArrowUp":{
            event.preventDefault();
            controls.previous()
            break;
          }

          default:break;
      }
    };

    window.addEventListener("keydown", handlerKeyDown);

    return () => {
      window.removeEventListener("keydown", handlerKeyDown);
    };
  }, [controls]);
}
