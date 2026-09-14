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

  const { data, isPending, isError, error } = useChapterPages(chapterId!);

  // to fetch next chapter & previous chapter
  const {
    data: chapterData,
    isPending: isChaptersPending,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isFetchNextPageError,
  } = useInfiniteChapterList(mangaId!);

  const chapters = chapterData?.pages.flatMap((page) => page.items) ?? [];

  const loadMoreChapters = async () => {
    await fetchNextPage();
  };

  const {
    previousChapter,
    nextChapter,
    hasNext,
    hasPrevious,
    goNextChapter,
    goPreviousChapter,
    navigationStatus,
    pendingNavigation,
  } = useChapterNavigation(
    chapters,
    mangaId,
    chapterId,
    !!hasNextPage,
    loadMoreChapters,
    isFetchingNextPage,
    isFetchNextPageError,
  );

  const {
    currentPage,
    observePage,
    
    // long - strip page
    scrollToNextPage,
    scrollToPreviousPage,
    // scrollToPage,
    targetPage,
    requestScrollToPage,

    // single click page
    goToNextPage,
    goToPreviousPage,
    goToPage,
  } = useCurrentReaderPage();

  useReaderPreload(data ?? [], currentPage, PREFETCH_AHEAD);

  const controls = useReaderControls({
    currentPage,
    totalPages: data?.length ?? 0,

    scrollToNextPage,
    scrollToPreviousPage,
    // scrollToPage,
    requestScrollToPage,

    nextChapter: goNextChapter,
    previousChapter: goPreviousChapter,

    clickNextPage: goToNextPage,
    clickPreviousPage: goToPreviousPage,
    goToPage,

  });

  useKeyboardNavigation({
    controls,
  });

  if (isPending || isChaptersPending) {
    return <div>Loading pages ...</div>;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  const pages = data ?? [];

  const readerClassName =
    settings.theme === "dark" ? "reader reader-dark" : "reader reader-light";

  console.log({
    isChaptersPending,
    isFetchingNextPage,
    isFetchNextPageError,
    pendingNavigation,
    navigationStatus,
  });

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
        Current Page : {currentPage}
      </div>
      <ReaderNavigation
        previousChapter={previousChapter}
        nextChapter={nextChapter}
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
          onNextPage={controls.clickPage.clickNext}
          onPreviousPage={controls.clickPage.clickPrevious}
        />
      )}
      <div>
        <ReaderProgress
          currentPage={currentPage}
          totalPages={pages.length}
          onGoToPage={settings.pageMode === "long-strip" ? controls.scrollPage.goTo:controls.clickPage.goTo}
        />
      </div>
    </div>
  );
}

export default ReaderPage;
