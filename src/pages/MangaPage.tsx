import InfiniteScrollTrigger from "../features/manga/components/InfiniteScrollTrigger/InfiniteScrollTrigger";
import MangaCard from "../features/manga/components/MangaCard/MangaCard";
import MangaList from "../features/manga/components/MangaList/MangaList";
import { useMangaList } from "../features/manga/hooks/useMangaList";

function MangaPage() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isPending, isError, error } = useMangaList();


  const mangas = data?.pages.flatMap(page=>page.items)??[];

  if (isPending) {
    return <div style={{ padding: 24 }}>Loading Manga ...</div>;
  }

  if (isError) {
    return <div style={{ padding: 24 }}>Error:{error.message}</div>;
  }

  return <div>
    <MangaList mangas={mangas}/>
    <button
      onClick={()=>fetchNextPage()}
      disabled={!hasNextPage}
    >
      {
        hasNextPage && (
          <InfiniteScrollTrigger
            onLoadMore={()=>fetchNextPage()}
            disabled={isFetchingNextPage}/>
        )
      }

    </button>
  </div>;
}

export default MangaPage;
