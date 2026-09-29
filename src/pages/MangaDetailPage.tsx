import { useParams } from "react-router-dom";
import { useMangaDetail } from "../features/manga/hooks/useMangaDetails";
import ChapterList from "../features/chapter/components/ChapterList/ChapterList";
import { useInfiniteChapterList } from "../features/chapter/hooks/useInfiniteChapterList";
import InfiniteScrollTrigger from "../utilsComponents/InfiniteScrollTrigger/InfiniteScrollTrigger";
import { sortChapters } from "../features/utils/chapterSort";
import "./scss/MangaDetailPage.scss";


function MangaDetailPage() {
  const { mangaId } = useParams();


  const {
    data,
    isPending,
    isError,
    error,
  } = useMangaDetail(mangaId!);


  const {
    data: chaptersData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteChapterList(mangaId!);


  const chapters = sortChapters(
    chaptersData?.pages.flatMap((page) => page.items) ?? []
  );


  if (isPending) {
    return (
      <main className="manga-detail-page">
        <section className="manga-detail-page__loading">
          <div className="manga-detail-page__loading-mark">
            <span />
            <span />
            <span />
          </div>


          <p>Loading archive</p>
        </section>
      </main>
    );
  }


  if (isError) {
    return (
      <main className="manga-detail-page">
        <section className="manga-detail-page__error">
          <div className="manga-detail-page__error-symbol">
            !
          </div>


          <div>
            <p className="manga-detail-page__eyebrow">
              ARCHIVE ERROR
            </p>


            <h1>
              Unable to load manga
            </h1>


            <p>
              {error.message}
            </p>
          </div>
        </section>
      </main>
    );
  }


  return (
    <main className="manga-detail-page">
      <div className="manga-detail-page__shell">


        {/* =====================================================
            HERO
        ====================================================== */}


        <section className="manga-detail-hero">
          <div className="manga-detail-hero__image-area">
            {data.coverLargeUrl ? (
              <img
                className="manga-detail-hero__cover"
                src={data.coverLargeUrl}
                alt={data.title}
                loading="eager"
                decoding="async"
              />
            ) : (
              <div className="manga-detail-hero__cover-fallback">
                <span>
                  NO COVER
                </span>
              </div>
            )}


            <div className="manga-detail-hero__cover-frame" />
          </div>


          <div className="manga-detail-hero__content">
            <div className="manga-detail-hero__eyebrow-row">
              <span className="manga-detail-hero__eyebrow">
                MANGA ARCHIVE
              </span>


              <span className="manga-detail-hero__number">
                01
              </span>
            </div>


            <h1 className="manga-detail-hero__title">
              {data.title}
            </h1>


            <div className="manga-detail-hero__accent" />


            <p className="manga-detail-hero__description">
              {data.description || "No description available."}
            </p>


            {/* =================================================
                META
            ================================================== */}


            <div className="manga-detail-meta">
              <div className="manga-detail-meta__item">
                <span className="manga-detail-meta__label">
                  STATUS
                </span>


                <span className="manga-detail-meta__value">
                  {data.status || "Unknown"}
                </span>
              </div>


              <div className="manga-detail-meta__item">
                <span className="manga-detail-meta__label">
                  AUTHOR
                </span>


                <span className="manga-detail-meta__value">
                  {data.author.length > 0
                    ? data.author.join(", ")
                    : "Unknown"}
                </span>
              </div>


              <div className="manga-detail-meta__item">
                <span className="manga-detail-meta__label">
                  ARTIST
                </span>


                <span className="manga-detail-meta__value">
                  {data.artist.length > 0
                    ? data.artist.join(", ")
                    : "Unknown"}
                </span>
              </div>
            </div>


            {/* =================================================
                TAGS
            ================================================== */}


            {data.tags.length > 0 && (
              <div className="manga-detail-tags">
                <span className="manga-detail-tags__label">
                  TAGS
                </span>


                <div className="manga-detail-tags__list">
                  {data.tags.map((tag) => (
                    <span
                      key={tag}
                      className="manga-detail-tag"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>


        {/* =====================================================
            CHAPTER SECTION
        ====================================================== */}


        <section className="manga-detail-chapters">
          <header className="manga-detail-chapters__header">
            <div>
              <p className="manga-detail-page__eyebrow">
                READING ARCHIVE
              </p>


              <h2 className="manga-detail-chapters__title">
                Chapters
              </h2>
            </div>


            <div className="manga-detail-chapters__count">
              <span>
                {chapters.length}
              </span>


              <small>
                LOADED
              </small>
            </div>
          </header>


          <div className="manga-detail-chapters__divider" />


          <ChapterList
            mangaId={mangaId!}
            chapters={chapters}
          />


          {/* =================================================
              LOAD MORE
          ================================================== */}


          <div className="manga-detail-chapters__pagination">
            {isFetchingNextPage && (
              <div className="manga-detail-chapters__loading">
                <span className="manga-detail-chapters__loading-dot" />


                <span>
                  Loading chapters
                </span>
              </div>
            )}


            <InfiniteScrollTrigger
              enabled={
                !!hasNextPage &&
                !isFetchingNextPage
              }
              onLoadMore={() => {
                fetchNextPage();
              }}
            />
          </div>
        </section>
      </div>
    </main>
  );
}


export default MangaDetailPage;



