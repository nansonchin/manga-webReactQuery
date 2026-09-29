import InfiniteScrollTrigger from "../utilsComponents/InfiniteScrollTrigger/InfiniteScrollTrigger";
import MangaList from "../features/manga/components/MangaList/MangaList";
import { useMangaList } from "../features/manga/hooks/useMangaList";
import "./scss/MangaPage.scss";


function MangaPage() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isPending,
    isError,
    error,
  } = useMangaList();


  const mangas = data?.pages.flatMap((page) => page.items) ?? [];


  if (isPending) {
    return (
      <main className="manga-page">
        <section className="manga-page__loading">
          <div className="manga-page__loading-mark">
            <span />
            <span />
            <span />
          </div>


          <p className="manga-page__loading-label">
            Loading archive
          </p>
        </section>
      </main>
    );
  }


  if (isError) {
    return (
      <main className="manga-page">
        <section className="manga-page__error">
          <div className="manga-page__error-symbol">
            !
          </div>


          <div>
            <p className="manga-page__eyebrow">
              ARCHIVE ERROR
            </p>


            <h1 className="manga-page__error-title">
              Unable to load manga
            </h1>


            <p className="manga-page__error-message">
              {error.message}
            </p>
          </div>
        </section>
      </main>
    );
  }


  return (
    <main className="manga-page">
      <header className="manga-page__header">
        <div className="manga-page__heading">
          <p className="manga-page__eyebrow">
            MANGA ARCHIVE
          </p>


          <h1 className="manga-page__title">
            Library
          </h1>


          <p className="manga-page__description">
            Explore your manga collection.
          </p>
        </div>


        <div className="manga-page__header-mark">
          <span className="manga-page__header-line" />


          <span className="manga-page__header-symbol">
            B
          </span>
        </div>
      </header>


      <section className="manga-page__content">
        <MangaList mangas={mangas} />
      </section>


      <div className="manga-page__pagination">
        {isFetchingNextPage && (
          <div className="manga-page__loading-more">
            <span className="manga-page__loading-dot" />
            <span>Loading more</span>
          </div>
        )}


        <InfiniteScrollTrigger
          enabled={!!hasNextPage && !isFetchingNextPage}
          onLoadMore={() => {
            fetchNextPage();
          }}
        />
      </div>
    </main>
  );
}


export default MangaPage;



