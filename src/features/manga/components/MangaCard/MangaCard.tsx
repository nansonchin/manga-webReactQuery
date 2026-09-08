import { usePrefetchManga } from "../../hooks/usePrefetchManga";
import MangaImage from "../MangaImage/MangaImage";
import "./MangaCard.scss";

type MangaCardProps = {
  id:string;
  title: string;
  description: string;
  coverUrl: string | null;
  coverSmallUrl: string | null;
  coverLargeUrl: string | null;
};

function MangaCard({ id, title, description, coverSmallUrl }: MangaCardProps) {
  
  const prefetchManga=usePrefetchManga()

  return (
    <article className="manga-card" onMouseEnter={()=>{
      prefetchManga(id)
    }}>
      <div className="manga-card_cover">
        <MangaImage src={coverSmallUrl} alt={title}/>
      </div>

      <div className="manga-card_body">
        <div className="manga-card_title">{title}</div>
        <div className="manga-card_description">{description}</div>
      </div>
    </article>
  );
}

export default MangaCard;
