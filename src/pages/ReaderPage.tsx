import { useParams } from "react-router-dom";
import { useChapterPages } from "../features/reader/hooks/useChapterPages";
import ReaderImage from "../features/reader/components/ReaderImage/ReaderImage";
import { useReaderPreload } from "../features/reader/hooks/useReaderPreload";
import { useCurrentReaderPage } from "../features/reader/hooks/useCurrentReaderPage";
import ReaderNavigation from "../features/readerNavigation/components/ReaderNavigation";
import { useChapterNavigation } from "../features/readerNavigation/hooks/useChapterNavigation";
import { useInfiniteChapterList } from "../features/chapter/hooks/useInfiniteChapterList";

const RENDER_AHEAD = 1;
const PREFETCH_AHEAD = 3;

function ReaderPage() {
  const { mangaId, chapterId } = useParams();

  if (!mangaId || !chapterId) {
    return <div>Invalid Reader Url</div>;
  }

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

  const loadMoreChapters = async() =>{
    await fetchNextPage()
  }

  const {
    previousChapter,
    nextChapter,
    hasNext,
    hasPrevious,
    goNextChapter,
    goPreviousChapter,
    pendingNavigation,
    navigationStatus,
  } = useChapterNavigation(
    chapters,
    mangaId,
    chapterId,
    hasNextPage,
    loadMoreChapters,
    isFetchingNextPage,
    isFetchNextPageError
  );

  const { currentPage, observePage } = useCurrentReaderPage();

  useReaderPreload(data ?? [], currentPage, PREFETCH_AHEAD);

  if (isPending || isChaptersPending) {
    return <div>Loading pages ...</div>;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
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
        isLoadingPrevious={
          isFetchingNextPage && pendingNavigation ==="previous"
        }
        // since now the api will always get the latest, which means next for now will always have the chapter instead of previous. 
        // next page error will not be trigger for now
        isPreviousError={isFetchNextPageError}
      />

      {data.map((page) => {
        const shouldLoad = page.index <= currentPage + RENDER_AHEAD;
        return (
          <div
            key={page.index}
            data-page={page.index + 1}
            //callback ref for dynamic ref reading
            ref={observePage}
          >
            <ReaderImage
              src={page.url}
              alt={`Page ${page.index + 1}`}
              shouldLoad={shouldLoad}
            />
          </div>
        );
      })}
    </div>
  );
}

export default ReaderPage;
