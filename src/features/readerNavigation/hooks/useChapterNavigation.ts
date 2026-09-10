import { useNavigate } from "react-router-dom";

type Chapter = {
  id: string;
};

export function useChapterNavigation(
  chapters: Chapter[],
  mangaId:string,
  currentChapterId: string,
) {
  const navigate = useNavigate();

  const currentIndex = chapters.findIndex(
    (chapter) => chapter.id === currentChapterId,
  );
   // chapter sorting [10,9,8]
   
  const previousChapter =  currentIndex >=0 && currentIndex < chapters.length-1 ? chapters[currentIndex+1]:null; 

  const nextChapter= currentIndex > 0 ? chapters[currentIndex -1]:null

  const goPreviousChapter = ()=>{
    if(!previousChapter){
        return
    }
    navigate(`/manga/${mangaId}/chapter/${previousChapter.id}`)
  }

  const goNextChapter = ()=>{
    if(!nextChapter){
        return
    }

    navigate(
        `/manga/${mangaId}/chapter/${nextChapter.id}`
    )
  }

  return{
    previousChapter,
    nextChapter,
    goPreviousChapter,
    goNextChapter,
    hasPrevious:!!previousChapter,
    hasNext:!!nextChapter,
  }
}
