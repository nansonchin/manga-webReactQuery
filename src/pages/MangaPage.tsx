import InfiniteScrollTrigger from "../utilsComponents/InfiniteScrollTrigger/InfiniteScrollTrigger";
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
    <InfiniteScrollTrigger

        enabled={
          !!hasNextPage &&
          !isFetchingNextPage
        }

        onLoadMore={()=>{
          fetchNextPage()
        }}

      />
  </div>;
}

export default MangaPage;
