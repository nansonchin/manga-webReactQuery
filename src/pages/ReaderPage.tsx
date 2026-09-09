import { useParams } from "react-router-dom";
import { useChapterPages } from "../features/reader/hooks/useChapterPages";
import ReaderImage from "../features/reader/components/ReaderImage/ReaderImage";
import { useReaderPreload } from "../features/reader/hooks/useReaderPreload";
import { useCurrentReaderPage } from "../features/reader/hooks/useCurrentReaderPage";

const RENDER_AHEAD = 1;
const PREFETCH_AHEAD = 3;

function ReaderPage() {
  const { chapterId } = useParams();

  const { data, isPending, isError, error } = useChapterPages(chapterId!);

  const { currentPage, observePage } = useCurrentReaderPage();

  useReaderPreload(data ?? [], currentPage, PREFETCH_AHEAD);

  if (isPending) {
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
