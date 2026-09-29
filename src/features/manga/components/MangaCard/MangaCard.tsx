import { buildCoverSrcSet } from "../../../utils/image";
import { usePrefetchManga } from "../../hooks/usePrefetchManga";
import MangaImage from "../MangaImage/MangaImage";
import "./MangaCard.scss";


type MangaCardProps = {
  id: string;
  title: string;
  description: string;
  coverUrl: string | null;
  coverSmallUrl: string | null;
  coverLargeUrl: string | null;
};


function MangaCard({
  id,
  title,
  description,
  coverSmallUrl,
  coverLargeUrl,
}: MangaCardProps) {
  const prefetchManga = usePrefetchManga();


  const srcSet = buildCoverSrcSet(
    coverSmallUrl,
    coverLargeUrl
  );


  return (
    <article
      className="manga-card"
      onMouseEnter={() => {
        prefetchManga(id);
      }}
    >
      <div className="manga-card__cover">
        <MangaImage
          src={coverSmallUrl}
          srcSet={srcSet}
          sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 220px"
          alt={title}
        />


        <div className="manga-card__cover-overlay">
          <span className="manga-card__cover-label">
            READ
          </span>
        </div>


        <div className="manga-card__corner manga-card__corner--top" />
        <div className="manga-card__corner manga-card__corner--bottom" />
      </div>


      <div className="manga-card__body">
        <div className="manga-card__meta">
          <span className="manga-card__meta-line" />
          <span>MANGA</span>
        </div>


        <h2 className="manga-card__title">
          {title}
        </h2>


        {description && (
          <p className="manga-card__description">
            {description}
          </p>
        )}


        <div className="manga-card__footer">
          <span className="manga-card__footer-label">
            OPEN SERIES
          </span>


          <span className="manga-card__arrow">
            →
          </span>
        </div>
      </div>
    </article>
  );
}


export default MangaCard;



