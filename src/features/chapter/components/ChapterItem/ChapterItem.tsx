import { Link } from "react-router-dom";
import type { Chapter } from "../../types";
import { usePrefetchChapterPages } from "../../../reader/hooks/usePrefetchChapterPages";
import { useHoverPrefetch } from "../../../reader/hooks/useHoverPrefetch";
import "./ChapterItem.scss";


type ChapterItemProps = {
  mangaId: string;
  chapter: Chapter;
};


function ChapterItem({
  mangaId,
  chapter,
}: ChapterItemProps) {
  const prefetchChapterPages = usePrefetchChapterPages();


  const hoverProps = useHoverPrefetch(() => {
    prefetchChapterPages(chapter.id);
  });


  const chapterNumber = chapter.chapter ?? "-";
  const chapterTitle = chapter.title || "No title";
  const language = chapter.translatedLanguage || "Unknown";


  return (
    <Link
      to={`/manga/mangaId/chapter/${chapter.id}`}
      className="chapter-link"
      {...hoverProps}
    >
      <article className="chapter-item">
        <div className="chapter-item__number">
          <span className="chapter-item__number-label">
            CH
          </span>


          <span className="chapter-item__number-value">
            {chapterNumber}
          </span>
        </div>


        <div className="chapter-item__content">
          <span className="chapter-item__eyebrow">
            Chapter {chapterNumber}
          </span>


          <h3 className="chapter-item__title">
            {chapterTitle}
          </h3>
        </div>


        <div className="chapter-item__meta">
          <span className="chapter-item__language">
            {language}
          </span>


          <span
            className="chapter-item__arrow"
            aria-hidden="true"
          >
            →
          </span>
        </div>
      </article>
    </Link>
  );
}


export default ChapterItem;





