import { useParams } from "react-router-dom";
import { useChapterPages } from "../features/reader/hooks/useChapterPages";
import ReaderImage from "../features/reader/components/ReaderImage/ReaderImage";
import { useReaderPreload } from "../features/reader/hooks/useReaderPreload";
import { useCurrentReaderPage } from "../features/reader/hooks/useCurrentReaderPage";
import ReaderNavigation from "../features/readerNavigation/components/ReaderNavigation";
import { useChapterNavigation } from "../features/readerNavigation/hooks/useChapterNavigation";
import { useInfiniteChapterList } from "../features/chapter/hooks/useInfiniteChapterList";
import { useKeyboardNavigation } from "../features/reader/hooks/useKeyboardNavigation";
import { useReaderControls } from "../features/reader/hooks/useReaderControl";
import {
  ReaderSettingsProvider,
  useReaderSettings,
} from "../features/readerSetting/context/ReaderSettingContext";
import ReaderSettingsPanel from "../features/readerSetting/components/ReaderSettingsPanel";
import LongStripReader from "../features/reader/components/LongStripReader/LongStripReader";
import SinglePageReader from "../features/reader/components/SinglePageReader/SinglePageReader";
import { ReaderProgress } from "../features/readerProgress/components/ReaderProgress";
import { useCallback, useEffect } from "react";
import { useReaderData } from "../features/reader/hooks/useReaderData";
import { useLongStripPageTracking } from "../features/reader/hooks/useLongStripPageTracking";
import { useLongStripNavigation } from "../features/reader/hooks/useLongStripNavigation";

const RENDER_AHEAD = 1;
const PREFETCH_AHEAD = 3;

function ReaderPage() {
  const { mangaId, chapterId } = useParams();

  if (!mangaId || !chapterId) {
    return <div>Invalid Reader Url</div>;
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

  const {pages, chapters, pagesQuery, chaptersQuery} = useReaderData({mangaId,chapterId})
  const totalPages = pages.length

  const isLongStrip = settings.pageMode==="long-strip"
  const {
    previousChapter,
    nextChapter,
    hasNext,
    hasPrevious,
    goNextChapter,
    goPreviousChapter,
    pendingNavigation,
    needsMoreChapters,
    navigationStatus
  } = useChapterNavigation(
    chapters,
    mangaId,
    chapterId,
    chaptersQuery.hasNextPage?? false,
    chaptersQuery.fetchNextPage,
    chaptersQuery.isFetchingNextPage,
    chaptersQuery.isFetchNextPageError,
  );


  const {
    currentPage,
    setCurrentPageFromTracking,
    
    // long - strip page
    // scrollToNextPage,
    // scrollToPreviousPage,
    // scrollToPage,
    // targetPage,
    // requestScrollToPage,

    // single click page
    goToNextPage,
    goToPreviousPage,
    goToPage,
  } = useCurrentReaderPage({
    totalPages
  });

  const {targetPage,scrollToNextPage,scrollToPreviousPage,requestScrollToPage} = useLongStripNavigation({currentPage,totalPages})


  const {observePage} = useLongStripPageTracking({enabled:isLongStrip,onPageChange:setCurrentPageFromTracking})

  useReaderPreload(pages, currentPage, PREFETCH_AHEAD);

  const nextPage = isLongStrip? scrollToNextPage:goToNextPage

  const previousPage = isLongStrip? scrollToPreviousPage:goToPreviousPage

  const goToReaderPage = isLongStrip? requestScrollToPage:goToPage

  const controls = useReaderControls({
    currentPage,
    totalPages,
    // scrollToNextPage,
    // scrollToPreviousPage,
    // scrollToPage,
    // requestScrollToPage,

    nextChapter: goNextChapter,
    previousChapter: goPreviousChapter,

    // clickNextPage: goToNextPage,
    // clickPreviousPage: goToPreviousPage,
    nextPage,
    previousPage,
    goToPage,

  });

  useKeyboardNavigation({
    controls,
  });

  if (pagesQuery.isPending) {
    return <div>Loading pages ...</div>;
  }

  if (pagesQuery.isError) {
    return <div>Error: {pagesQuery.error.message}</div>;
  }


  const readerClassName =
    settings.theme === "dark" ? "reader reader-dark" : "reader reader-light";

  return (
    <div className={readerClassName}>
      <ReaderSettingsPanel />
      <div
        style={{
          position: "fixed",
          top: 10,
          left: 10,
          background: "#fff",
          zIndex: 10,
        }}
      >
        Current Page : {currentPage+1}
      </div>
      <ReaderNavigation
        // previousChapter={previousChapter}
        // nextChapter={nextChapter}
        hasPrevious={hasPrevious}
        hasNext={hasNext}
        onPrevious={goPreviousChapter}
        onNext={goNextChapter}
        navigationStatus={navigationStatus}
      />

      {settings.pageMode === "long-strip" ? (
        <LongStripReader
          pages={pages}
          currentPage={currentPage}
          renderAhead={RENDER_AHEAD}
          observePage={observePage}
          targetPage={targetPage}
        />
      ) : (
        <SinglePageReader
          pages={pages}
          currentPage={currentPage}
          // observePage={observePage}
          onNextPage={nextPage}
          onPreviousPage={previousPage}
        />
      )}
      <div>
        <ReaderProgress
          currentPage={currentPage}
          totalPages={pages.length}
          onGoToPage={goToReaderPage}
        />
      </div>
    </div>
  );
}

export default ReaderPage;
