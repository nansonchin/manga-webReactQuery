import type { Chapter } from "../../types";
import ChapterItem from "../ChapterItem/ChapterItem";
import "./ChapterList.scss";


type ChapterListProps = {
  chapters: Chapter[];
  mangaId: string;
};


function ChapterList({
  chapters,
  mangaId,
}: ChapterListProps) {
  return (
    <section className="chapter-list" aria-label="Chapter list">
      <div className="chapter-list__header">
        <div className="chapter-list__heading">
          <span className="chapter-list__eyebrow">
            Archive
          </span>


          <h2 className="chapter-list__title">
            Chapters
          </h2>
        </div>


        <div className="chapter-list__count">
          <span className="chapter-list__count-value">
            {chapters.length}
          </span>


          <span className="chapter-list__count-label">
            Available
          </span>
        </div>
      </div>


      <div className="chapter-list__line" />


      {chapters.length > 0 ? (
        <div className="chapter-list__items">
          {chapters.map((chapter) => (
            <ChapterItem
              key={chapter.id}
              mangaId={mangaId}
              chapter={chapter}
            />
          ))}
        </div>
      ) : (
        <div className="chapter-list__empty">
          <span className="chapter-list__empty-mark">
            —
          </span>


          <div>
            <p className="chapter-list__empty-title">
              No chapters available
            </p>


            <p className="chapter-list__empty-description">
              There are currently no chapters available for
              this title.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}


export default ChapterList;





