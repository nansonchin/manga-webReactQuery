import { useParams } from "react-router-dom";
import { useMangaDetail } from "../features/manga/hooks/useMangaDetails";
import { useChapterList } from "../features/chapter/hooks/useChapterList";
import ChapterList from "../features/chapter/components/ChapterList/ChapterList";
import { useInfiniteChapterList } from "../features/chapter/hooks/useInfiniteChapterList";
import InfiniteScrollTrigger from "../utilsComponents/InfiniteScrollTrigger/InfiniteScrollTrigger";
import { sortChapters } from "../features/utils/chapterSort";

function MangaDetailPage() {
  const { id } = useParams();

  const { data, isPending, isError, error } = useMangaDetail(id!);

  const {
    data: chaptersData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteChapterList(id!);

  const chapters = sortChapters(
    chaptersData?.pages.flatMap(page=>page.items)??[]
  )

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>error: {error.message}</div>;
  }
  return (
    <div>
      //Details
      <div>
        {data.coverLargeUrl && (
          <img
            src={data.coverLargeUrl}
            alt={data.title}
            loading="lazy"
            decoding="async"
          />
        )}
        <h1>{data.title}</h1>
        <p>{data.description}</p>
        <div>Status: {data.status}</div>
        <div>
          Author:
          {data.author.map((author) => (
            <span key={author}>{author}</span>
          ))}
        </div>
        <div>
          Artist:{" "}
          {data.artist.map((artist) => (
            <span key={artist}>{artist}</span>
          ))}
        </div>
        <div>
          Tags:{" "}
          {data.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
      </div>
      <div>Chapters</div>
      <ChapterList chapters={chapters ?? []} />
      <InfiniteScrollTrigger
        enabled={!!hasNextPage && !isFetchingNextPage}
        onLoadMore={fetchNextPage}
      />
    </div>
  );
}

export default MangaDetailPage;
