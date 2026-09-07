import MangaCard from "../features/manga/components/MangaCard/MangaCard";
import MangaList from "../features/manga/components/MangaList/MangaList";
import { useMangaList } from "../features/manga/hooks/useMangaList";

function MangaPage() {
  const { data, isPending, isError, error } = useMangaList();

  if (isPending) {
    return <div style={{ padding: 24 }}>Loading Manga ...</div>;
  }

  if (isError) {
    return <div style={{ padding: 24 }}>Error:{error.message}</div>;
  }

  return <div>
    <MangaList mangas={data}/>
  </div>;
}

export default MangaPage;
