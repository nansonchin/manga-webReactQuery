import { useParams } from "react-router-dom";
import { useChapterPages } from "../features/reader/hooks/useChapterPages";

function ReaderPage() {
  const { chapterId } = useParams();

  const { data, isPending, isError, error } = useChapterPages(chapterId!);

  if (isPending) {
    return <div>Loading pages ...</div>;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      {data.map((page) => (
        <img key={page.index} src={page.url} alt={`page ${page.index + 1}`} />
      ))}
    </div>
  );
}

export default ReaderPage