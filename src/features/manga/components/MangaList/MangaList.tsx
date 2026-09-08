import MangaCard from "../MangaCard/MangaCard";
import type { Manga } from "../../types";
import { Link } from "react-router-dom";

type MangaListProps = {
  mangas: Manga[];
};

function MangaList({ mangas }: MangaListProps) {
  return (
    <div style={{ padding: 24 }}>
      <h1>MangaDex Demo</h1>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px,1fr))",
          marginTop: "24px",
        }}
      >
        {mangas.map((manga) => (
          <Link
            style={{ textDecoration: "none", color: "inherit" }}
            key={manga.id}
            to={`/manga/${manga.id}`}
          >
            <MangaCard
              key={manga.id}
              id={manga.id}
              title={manga.title}
              description={manga.description}
              coverSmallUrl={manga.coverSmallUrl}
              coverUrl={null}
              coverLargeUrl={null}
            />
          </Link>
        ))}
      </div>
    </div>
  );
}

export default MangaList;
