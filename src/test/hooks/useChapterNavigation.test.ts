import { describe, expect, it, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor, render } from "@testing-library/react";

import { useChapterNavigation } from "../../features/readerNavigation/hooks/useChapterNavigation";
import { useNavigate } from "react-router-dom";

const navigateMock = vi.fn();

vi.mock("react-router-dom", () => ({
  useNavigate: () => navigateMock,
}));

describe("useChapterNavigation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const chapters = [
    {
      id: "10",
      chapter: "10",
      title: null,
      volume: null,
      translatedLanguage: "en",
      pages: 20,
    },
    {
      id: "9",
      chapter: "9",
      title: null,
      volume: null,
      translatedLanguage: "en",
      pages: 20,
    },
    {
      id: "8",
      chapter: "8",
      title: null,
      volume: null,
      translatedLanguage: "en",
      pages: 20,
    },
    {
      id: "7",
      chapter: "7",
      title: null,
      volume: null,
      translatedLanguage: "en",
      pages: 20,
    },
  ];

  it("navigates directly when previous chapter is alread loaded",()=>{
    const fetchNextPage = vi.fn();

    const {result}=renderHook(()=>useChapterNavigation({chapters,
        mangaId:"manga-1",currentChapterId:"8",
        hasMoreChapters:true,fetchNextPage,isLoadingMoreChapters:false,isFetchNextPageError:false}))
  
    act(()=>{
        result.current.goPreviousChapter()
    })

    expect(navigateMock).toHaveBeenCalledWith("/manga/manga-1/chapter/7")
})

it("fetches the next chapter page when previous chapter is not loaded",()=>{
    const fetchNextPage = vi.fn().mockResolvedValue({})
    const loadedChapters =[
        chapters[0],
        chapters[1],
        chapters[2]
    ]

    const {result}= renderHook(()=>
        useChapterNavigation({
            chapters:loadedChapters, mangaId:"manga-1",currentChapterId:"8",
            hasMoreChapters:true,fetchNextPage,isLoadingMoreChapters:false,isFetchNextPageError:false})
    )

     act(()=>{
        result.current.goPreviousChapter()
    })

    expect(fetchNextPage).toHaveBeenCalledTimes(1)
    expect(navigateMock).not.toHaveBeenCalled()
})

it("navigates after fetching reveals the previous chapter", async()=>{
    const fetchNextPage = vi.fn().mockResolvedValue({})

    const loadedChapters=[
        chapters[0],
        chapters[1],
        chapters[2],

    ]

    const {result,rerender}=renderHook(({chapters})=>useChapterNavigation({
        chapters,
        mangaId:"manga-1",
        currentChapterId:"8",
        hasMoreChapters:true,
        fetchNextPage,
        isLoadingMoreChapters:false,
        isFetchNextPageError:false}),
        {initialProps:{chapters:loadedChapters}})

    act(()=>{
        result.current.goPreviousChapter()
    })

    expect(fetchNextPage).toHaveBeenCalledTimes(1)

    rerender({
        chapters:[
            ...loadedChapters,
            chapters[3]
        ]
    })

    await waitFor(()=>{
        expect(navigateMock).toHaveBeenCalledWith("/manga/manga-1/chapter/7")
    })
})

it("does not fetch whenthere are no more chapters",()=>{
    const fetchNextPage = vi.fn()

    const loadedChapters=[
        chapters[0],
        chapters[1],
        chapters[2]
    ]

    const {result}= renderHook(()=>useChapterNavigation({
        chapters:loadedChapters,
        mangaId:"manga-1",
        currentChapterId:"8",
        hasMoreChapters:false,
        fetchNextPage,
        isLoadingMoreChapters:false,
        isFetchNextPageError:false}))

    act(()=>{
        result.current.goPreviousChapter()
    })

    expect(fetchNextPage).not.toHaveBeenCalled()
    expect(navigateMock).not.toHaveBeenCalled()

})

it("does not fetch again while already loading",()=>{
    const fetchNextPage=vi.fn()

    const loadedChapters=[
        chapters[0],
        chapters[1],
        chapters[2]
    ]

    const {result}= renderHook(()=> useChapterNavigation(
        {chapters:loadedChapters,
        mangaId:"manga-1",
        currentChapterId:"8",
        hasMoreChapters:true,
        fetchNextPage,
        isLoadingMoreChapters:true,
        isFetchNextPageError:false
    }))

    act(()=>{
        result.current.goPreviousChapter()
    })

    expect(fetchNextPage).not.toHaveBeenCalled()
})

it("reports error when fetching the next chapter page fails",()=>{
    const fetchNextPage=vi.fn()

    const loadedChapters=[
        chapters[0],
        chapters[1],
        chapters[2]
    ]

    const {result} = renderHook(()=>useChapterNavigation({
        chapters:loadedChapters,
        mangaId:"manga-1",
        currentChapterId:"8",
        hasMoreChapters:true,
        fetchNextPage,
        isLoadingMoreChapters:false,
        isFetchNextPageError:true
    }))

    act(()=>{
        result.current.goPreviousChapter()
    })

    expect(result.current.navigationStatus).toBe("error")
})

it("navigates to next chapter when  it is already loaded",()=>{
    const fetchNextPage = vi.fn();

    const {result} = renderHook(()=>
        useChapterNavigation({
            chapters:chapters,
            mangaId:"manga-1",
            currentChapterId:"8",
            hasMoreChapters:true,
            fetchNextPage,
            isLoadingMoreChapters:false,
            isFetchNextPageError:false
        })
    )

    act(()=>{
        result.current.goNextChapter()
    })

    expect(navigateMock).toHaveBeenCalledWith("/manga/manga-1/chapter/9")

    expect(fetchNextPage).not.toHaveBeenCalled()
})
});
