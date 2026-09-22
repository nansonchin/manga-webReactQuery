import { describe, expect, it } from "vitest";
import { getChapterNavigation } from "../../utils/getChapterNavigation";
import type { Chapter } from "../../features/chapter/types";

const createChapter = (id: string): Chapter => ({
  id,
  chapter: id,
  title: null,
  volume: null,
  translatedLanguage: "en",
  pages: 20,
});

describe("getChapterNavigation", () => {
  const chapters: Chapter[] = [
    createChapter("10"),
    createChapter("9"),
    createChapter("8"),
    createChapter("7"),
    createChapter("6"),
  ];

  it("returns prevous and next chapters correctly", () => {
    const result = getChapterNavigation(chapters, "8");

    expect(result.previousChapter?.id).toBe("7");
    expect(result.nextChapter?.id).toBe("9");
  });
  it("returns null previous chapter at the odler loaded chapter", () => {
    const result = getChapterNavigation(chapters, "6");
    expect(result.previousChapter).toBeNull();
    expect(result.nextChapter?.id).toBe("7");
  });

  it("returns null navigation when current chapter does not exist", () => {
    const result = getChapterNavigation(chapters, "999");
    expect(result.previousChapter).toBeNull();
    expect(result.nextChapter).toBeNull();
  });

  it("works with a single chapter", () => {
    const result = getChapterNavigation([createChapter("10")], "10");
    expect(result.previousChapter).toBeNull();
    expect(result.nextChapter).toBeNull();
  });
});
