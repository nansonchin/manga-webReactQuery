import "./MangaCard.scss";

type MangaCardProps = {
  title: string;
  description: string;
  coverUrl: string | null;
  coverSmallUrl: string | null;
  coverLargeUrl: string | null;
};

function MangaCard({ title, description, coverSmallUrl }: MangaCardProps) {
  return (
    <article className="manga-card">
      <div className="manga-card_cover">
        {coverSmallUrl ? (
          <img src={coverSmallUrl} alt={title} loading="lazy" decoding="async"/>
        ) : (
          <span>No Cover Yet</span>
        )}
      </div>

      <div className="manga-card_body">
        <div className="manga-card_title">{title}</div>
        <div className="manga-card_description">{description}</div>
      </div>
    </article>
  );
}

export default MangaCard;
