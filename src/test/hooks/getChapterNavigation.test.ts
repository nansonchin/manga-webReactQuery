import { describe, expect, it } from "vitest";
import { getChapterNavigation } from "../../utils/getChapterNavigation";

describe("getChapterNavigation", () => {
  const chapters = [
    { id: "10" },
    { id: "9" },
    { id: "8" },
    { id: "7" },
    { id: "6" },
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
    const result = getChapterNavigation([{ id: "10" }], "10");
    expect(result.previousChapter).toBeNull();
    expect(result.nextChapter).toBeNull();
  });
});
