import { Link } from "react-router-dom";
import type { Manga } from "../../types";
import MangaCard from "../MangaCard/MangaCard";
import "./MangaList.scss";


type MangaListProps = {
  mangas: Manga[];
};


function MangaList({ mangas }: MangaListProps) {
  return (
    <main className="manga-list">
      {/* =====================================================
          PAGE HEADER
          ===================================================== */}


      <header className="manga-list__header">
        <div className="manga-list__header-content">
          <div className="manga-list__eyebrow">
            <span className="manga-list__eyebrow-line" />


            <span>
              MANGA ARCHIVE
            </span>
          </div>


          <h1 className="manga-list__title">
            Library
          </h1>


          <p className="manga-list__description">
            Explore your manga collection.
          </p>
        </div>


        <div className="manga-list__header-meta">
          <span className="manga-list__count">
            {mangas.length.toString().padStart(2, "0")}
          </span>


          <span className="manga-list__count-label">
            TITLES
          </span>
        </div>
      </header>




      {/* =====================================================
          DECORATIVE DIVIDER
          ===================================================== */}


      <div className="manga-list__divider">
        <span className="manga-list__divider-line" />


        <span className="manga-list__divider-mark">
          ◆
        </span>


        <span className="manga-list__divider-line" />
      </div>




      {/* =====================================================
          EMPTY STATE
          ===================================================== */}


      {mangas.length === 0 ? (
        <section className="manga-list__empty">
          <div className="manga-list__empty-mark">
            —
          </div>


          <h2>
            No manga found
          </h2>


          <p>
            Your library is currently empty.
          </p>
        </section>
      ) : (
        /* ===================================================
           MANGA GRID
           =================================================== */


        <section
          className="manga-list__grid"
          aria-label="Manga library"
        >
          {mangas.map((manga) => (
            <Link
              key={manga.id}
              to={`/manga/${manga.id}`}
              className="manga-list__link"
            >
              <MangaCard
                id={manga.id}
                title={manga.title}
                description={manga.description}
                coverSmallUrl={manga.coverSmallUrl}
                coverUrl={null}
                coverLargeUrl={manga.coverLargeUrl}
              />
            </Link>
          ))}
        </section>
      )}
    </main>
  );
}


export default MangaList;



