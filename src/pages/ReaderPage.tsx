import { useParams } from "react-router-dom";

import { useReaderData } from "../features/reader/hooks/useReaderData";
import { useReaderPreload } from "../features/reader/hooks/useReaderPreload";
import { useCurrentReaderPage } from "../features/reader/hooks/useCurrentReaderPage";
import { useReaderProgressPersistence } from "../features/reader/hooks/useReaderProgressPersistence";
import { useReaderRestorePosition } from "../features/reader/hooks/useReaderRestorePosition";
import { useLongStripNavigation } from "../features/reader/hooks/useLongStripNavigation";
import { useLongStripPageTracking } from "../features/reader/hooks/useLongStripPageTracking";
import { useKeyboardNavigation } from "../features/reader/hooks/useKeyboardNavigation";
import { useReaderControls } from "../features/reader/hooks/useReaderControl";
import useReaderToolbar from "../features/readerToolbar/hooks/useReaderToolbar";

import LongStripReader from "../features/reader/components/LongStripReader/LongStripReader";
import SinglePageReader from "../features/reader/components/SinglePageReader/SinglePageReader";

import ReaderNavigation from "../features/readerNavigation/components/ReaderNavigation";
import { useChapterNavigation } from "../features/readerNavigation/hooks/useChapterNavigation";

import {
  ReaderSettingsProvider,
  useReaderSettings,
} from "../features/readerSetting/context/ReaderSettingContext";

import ReaderSettingsPanel from "../features/readerSetting/components/ReaderSettingsPanel";

import { ReaderProgress } from "../features/readerProgress/components/ReaderProgress";

import ReaderToolbar from "../features/readerToolbar/components/ReaderToolbar";

import "./scss/ReaderPage.scss";
import { useEffect, useState } from "react";
import { useLongStripVirtualizer } from "../features/reader/hooks/useLongStripVirtualizer";

const RENDER_AHEAD = 1;
const PREFETCH_AHEAD = 3;

function ReaderPage() {
  const { mangaId, chapterId } = useParams();

  if (!mangaId || !chapterId) {
    return <div>Invalid Reader URL</div>;
  }

  return (
    <ReaderSettingsProvider>
      <ReaderPageContent mangaId={mangaId} chapterId={chapterId} />
    </ReaderSettingsProvider>
  );
}

type ReaderPageContentProps = {
  mangaId: string;
  chapterId: string;
};

function ReaderPageContent({ mangaId, chapterId }: ReaderPageContentProps) {
  const { settings } = useReaderSettings();

  const [longStripScrollContainer, setLongStripScrollContainer] =
    useState<HTMLElement | null>(null);

  /**
   * ---------------------------------------------------------
   * Reader data
   * ---------------------------------------------------------
   */

  const { pages, chapters, pagesQuery, chaptersQuery } = useReaderData({
    mangaId,
    chapterId,
  });

  const totalPages = pages.length;

  /**
   * ---------------------------------------------------------
   * Reader mode
   * ---------------------------------------------------------
   */

  const isLongStrip = settings.pageMode === "long-strip";

  /**
   * ---------------------------------------------------------
   * Chapter navigation
   * ---------------------------------------------------------
   */

  const {
    hasNext,
    hasPrevious,
    goNextChapter,
    goPreviousChapter,
    navigationStatus,
  } = useChapterNavigation({
    chapters,
    mangaId,
    currentChapterId: chapterId,
    hasMoreChapters: chaptersQuery.hasNextPage ?? false,
    fetchNextPage: chaptersQuery.fetchNextPage,
    isLoadingMoreChapters: chaptersQuery.isFetchingNextPage,
    isFetchNextPageError: chaptersQuery.isFetchNextPageError,
  });

  /**
   * ---------------------------------------------------------
   * Current page
   * ---------------------------------------------------------
   */

  const {
    currentPage,
    setCurrentPageFromTracking,
    restorePage,
    goToNextPage,
    goToPreviousPage,
    goToPage,
  } = useCurrentReaderPage({
    totalPages,
  });

  /**
   * ---------------------------------------------------------
   * Progress persistence
   * ---------------------------------------------------------
   */

  const { parentRef: longStripParentRef, virtualizer } =
    useLongStripVirtualizer({
      count: totalPages,
    });
  const { restoredPage, hasRestored } = useReaderProgressPersistence({
    mangaId,
    chapterId,
    currentPage,
    totalPages,
  });

  /**
   * ---------------------------------------------------------
   * Long strip navigation
   * ---------------------------------------------------------
   */
  
  const { observePage } = useLongStripPageTracking({
    enabled: isLongStrip,
    root: longStripScrollContainer,
    onPageChange: setCurrentPageFromTracking,
  });

  const {
    // targetPage,
    scrollToNextPage,
    scrollToPreviousPage,
    requestScrollToPage,
  } = useLongStripNavigation({
    currentPage,
    totalPages,
    onPageChange:setCurrentPageFromTracking
  });

  /**
   * ---------------------------------------------------------
   * Long strip page tracking
   * ---------------------------------------------------------
   */


  /**
   * ---------------------------------------------------------
   * Image preload
   * ---------------------------------------------------------
   */

  useReaderPreload(pages, currentPage, PREFETCH_AHEAD);

  /**
   * ---------------------------------------------------------
   * Unified page navigation
   * ---------------------------------------------------------
   */

  const nextPage = isLongStrip ? scrollToNextPage : goToNextPage;

  const previousPage = isLongStrip ? scrollToPreviousPage : goToPreviousPage;

  const goToReaderPage = isLongStrip ? requestScrollToPage : goToPage;

  /**
   * ---------------------------------------------------------
   * Restore reader position
   * ---------------------------------------------------------
   */

  useReaderRestorePosition({
    restoredPage,
    hasRestored,
    isLongStrip,
    restorePage,
    requestScrollToPage,
  });

  /**
   * ---------------------------------------------------------
   * Reader controls
   * ---------------------------------------------------------
   */

  const controls = useReaderControls({
    currentPage,
    totalPages,

    nextChapter: goNextChapter,
    previousChapter: goPreviousChapter,

    nextPage,
    previousPage,

    goToPage: goToReaderPage,
  });

  /**
   * ---------------------------------------------------------
   * Keyboard navigation
   * ---------------------------------------------------------
   */

  useKeyboardNavigation({
    controls,
  });

  /**
   * ---------------------------------------------------------
   * Reader toolbar
   * ---------------------------------------------------------
   */

  const {
    isVisible: isToolbarVisible,
    isSettingsOpen,
    toggleVisibility,
    openSettings,
    closeSettings,
  } = useReaderToolbar({
    onPreviousPage: previousPage,
    onNextPage: nextPage,
    onPreviousChapter: goPreviousChapter,
    onNextChapter: goNextChapter,
  });

  /**
   * ---------------------------------------------------------
   * Loading state
   * ---------------------------------------------------------
   */
  useEffect(() => {
    console.log("CURRENT PAGE", currentPage + 1);
  }, [currentPage]);

  if (pagesQuery.isPending) {
    return <div className="reader-loading">Loading pages...</div>;
  }

  /**
   * ---------------------------------------------------------
   * Error state
   * ---------------------------------------------------------
   */

  if (pagesQuery.isError) {
    return (
      <div className="reader-error">Error: {pagesQuery.error.message}</div>
    );
  }

  /**
   * ---------------------------------------------------------
   * Reader theme
   * ---------------------------------------------------------
   */

  const readerClassName =
    settings.theme === "dark" ? "reader reader-dark" : "reader reader-light";

  /**
   * ---------------------------------------------------------
   * Render
   * ---------------------------------------------------------
   */

  return (
    <div className={readerClassName}>
      {/**
       * =====================================================
       * Reader Toolbar
       * =====================================================
       */}

      <ReaderToolbar
        currentPage={currentPage}
        totalPages={totalPages}
        hasPreviousChapter={hasPrevious}
        hasNextChapter={hasNext}
        isNavigationLoading={navigationStatus === "loading"}
        isVisible={isToolbarVisible}
        isSettingsOpen={isSettingsOpen}
        onPreviousPage={previousPage}
        onNextPage={nextPage}
        onPreviousChapter={goPreviousChapter}
        onNextChapter={goNextChapter}
        onProgressClick={() => {
          const progressButton =
            document.querySelector<HTMLButtonElement>(".reader-progress");

          progressButton?.click();
        }}
        onSettingsClick={() => {
          if (isSettingsOpen) {
            closeSettings();
          } else {
            openSettings();
          }
        }}
        onToggleVisibility={toggleVisibility}
      />

      {/**
       * =====================================================
       * Chapter Navigation
       * =====================================================
       */}

      <ReaderNavigation
        hasPrevious={hasPrevious}
        hasNext={hasNext}
        onPrevious={goPreviousChapter}
        onNext={goNextChapter}
        navigationStatus={navigationStatus}
      />

      {/**
       * =====================================================
       * Reader content
       * =====================================================
       */}

      <main className="reader-content">
        {isLongStrip ? (
          <LongStripReader
            pages={pages}
            currentPage={currentPage}
            renderAhead={RENDER_AHEAD}
            observePage={observePage}
            // targetPage={targetPage}
            onScrollContainerReady={setLongStripScrollContainer}
            parentRef={longStripParentRef}
            virtualizer={virtualizer}
          />
        ) : (
          <SinglePageReader
            pages={pages}
            currentPage={currentPage}
            onNextPage={nextPage}
            onPreviousPage={previousPage}
          />
        )}
      </main>

      {/**
       * =====================================================
       * Reader Progress
       * =====================================================
       */}

      <ReaderProgress
        currentPage={currentPage}
        totalPages={totalPages}
        onGoToPage={goToReaderPage}
      />

      {/**
       * =====================================================
       * Settings overlay
       * =====================================================
       */}

      {isSettingsOpen && (
        <div className="reader-settings-overlay" onClick={closeSettings}>
          <div
            className="reader-settings-container"
            onClick={(event) => {
              event.stopPropagation();
            }}
          >
            <button
              type="button"
              className="reader-settings-close"
              onClick={closeSettings}
              aria-label="Close reader settings"
            >
              ×
            </button>

            <ReaderSettingsPanel />
          </div>
        </div>
      )}
    </div>
  );
}

export default ReaderPage;
