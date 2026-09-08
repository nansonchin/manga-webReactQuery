import { buildCoverSrcSet } from "../../../utils/image";
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

function MangaCard({ id, title, description, coverSmallUrl,coverLargeUrl }: MangaCardProps) {
  
  const prefetchManga=usePrefetchManga()

  const srcSet = buildCoverSrcSet(
    coverSmallUrl,
    coverLargeUrl
  )
  return (
    <article className="manga-card" onMouseEnter={()=>{
      prefetchManga(id)
    }}>
      <div className="manga-card_cover">
        <MangaImage 
          //src for fallback
          src={coverSmallUrl}
          // srcSet to let the brwoser detect the image resolution, network condition, device px ratio need for the device 
          srcSet={srcSet} 
          alt={title}/>
      </div>

      <div className="manga-card_body">
        <div className="manga-card_title">{title}</div>
        <div className="manga-card_description">{description}</div>
      </div>
    </article>
  );
}

export default MangaCard;
