import { useCallback, useState } from "react";


type UseReaderToolbarProps = {
  onPreviousPage: () => void;
  onNextPage: () => void;
  onPreviousChapter: () => void;
  onNextChapter: () => void;
};


function useReaderToolbar({
  onPreviousPage,
  onNextPage,
  onPreviousChapter,
  onNextChapter,
}: UseReaderToolbarProps) {
  const [isVisible, setIsVisible] = useState(true);


  const [isSettingsOpen, setIsSettingsOpen] = useState(false);


  const toggleVisibility = useCallback(() => {
    setIsVisible((previous) => !previous);
  }, []);


  const showToolbar = useCallback(() => {
    setIsVisible(true);
  }, []);


  const hideToolbar = useCallback(() => {
    setIsVisible(false);
  }, []);


  const openSettings = useCallback(() => {
    setIsSettingsOpen(true);
  }, []);


  const closeSettings = useCallback(() => {
    setIsSettingsOpen(false);
  }, []);


  const toggleSettings = useCallback(() => {
    setIsSettingsOpen((previous) => !previous);
  }, []);


  return {
    isVisible,
    isSettingsOpen,


    toggleVisibility,
    showToolbar,
    hideToolbar,


    openSettings,
    closeSettings,
    toggleSettings,


    onPreviousPage,
    onNextPage,
    onPreviousChapter,
    onNextChapter,
  };
}


export default useReaderToolbar;



