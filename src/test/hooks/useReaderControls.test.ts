import { act, render, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useReaderControls } from "../../features/reader/hooks/useReaderControl";

describe("useReaderControls", () => {
  describe("next ()", () => {
    it("calls nextPage hen current page is not the last page", () => {
      const nextPage = vi.fn();
      const nextChapter = vi.fn();

      const { result } = renderHook(() =>
        useReaderControls({
          currentPage: 2,
          totalPages: 10,
          nextChapter,
          previousChapter: vi.fn(),
          nextPage,
          previousPage: vi.fn(),
          goToPage: vi.fn(),
        }),
      );

      act(() => {
        result.current.next();
      });

      expect(nextPage).toHaveBeenCalledTimes(1);
      expect(nextChapter).not.toHaveBeenCalled();
    });

    it("calls nextChapter when current page is the last page", () => {
      const nextPage = vi.fn();
      const nextChapter = vi.fn();

      const { result } = renderHook(() =>
        useReaderControls({
          currentPage: 9,
          totalPages: 10,
          nextChapter,
          previousChapter: vi.fn(),
          nextPage,
          previousPage: vi.fn(),
          goToPage: vi.fn(),
        }),
      );

      act(() => {
        result.current.next();
      });

      expect(nextChapter).toHaveBeenCalledTimes(1);
      expect(nextPage).not.toHaveBeenCalled();
    });

    it("calls nextChapter when there are no pages", () => {
      const nextPage = vi.fn();
      const nextChapter = vi.fn();

      const { result } = renderHook(() =>
        useReaderControls({
          currentPage: 0,
          totalPages: 0,
          nextChapter,
          previousChapter: vi.fn(),
          nextPage,
          previousPage: vi.fn(),
          goToPage: vi.fn(),
        }),
      );

      act(() => {
        result.current.next();
      });

      expect(nextChapter).toHaveBeenCalledTimes(1);
      expect(nextPage).not.toHaveBeenCalled();
    });
  });

  describe("previous()", () => {
    it("calls previousPage when current page is not the first Page", () => {
      const previousPage = vi.fn();
      const previousChapter = vi.fn();

      const { result } = renderHook(() =>
        useReaderControls({
          currentPage: 0,
          totalPages: 10,
          nextChapter: vi.fn(),
          previousChapter,
          nextPage: vi.fn(),
          previousPage,
          goToPage: vi.fn(),
        }),
      );

      act(() => {
        result.current.previous();
      });

      expect(previousChapter).toHaveBeenCalledTimes(1);
      expect(previousPage).not.toHaveBeenCalled();
    });
  });

  describe("goToSpecificPage()", () => {
    it("calls goToPage with a valid page number", () => {
      const goToPage = vi.fn();

      const { result } = renderHook(() =>
        useReaderControls({
          currentPage: 2,
          totalPages: 10,
          nextChapter: vi.fn(),
          previousChapter: vi.fn(),
          nextPage: vi.fn(),
          previousPage: vi.fn(),
          goToPage,
        }),
      );

      act(() => {
        result.current.page.goTo(5);
      });

      expect(goToPage).toHaveBeenCalledTimes(1);
      expect(goToPage).toHaveBeenCalledWith(5);
    });

    it("does not call goToPage when the page is negative", () => {
      const goToPage = vi.fn();

      const { result } = renderHook(() =>
        useReaderControls({
          currentPage: 2,
          totalPages: 10,
          nextChapter: vi.fn(),
          previousChapter: vi.fn(),
          nextPage: vi.fn(),
          previousPage: vi.fn(),
          goToPage,
        }),
      );

      act(() => {
        result.current.page.goTo(-1);
      });

      expect(goToPage).not.toHaveBeenCalled();
    });

    it("does not call goToPage when page is greater than or equal to totalPages", () => {
      const goToPage = vi.fn();

      const { result } = renderHook(() =>
        useReaderControls({
          currentPage: 2,
          totalPages: 10,
          nextChapter: vi.fn(),
          previousChapter: vi.fn(),
          nextPage: vi.fn(),
          previousPage: vi.fn(),
          goToPage,
        }),
      );

      act(() => {
        result.current.page.goTo(10);
      });

      expect(goToPage).not.toHaveBeenCalled();
    });

    it("does not call goToPage when page is not an integer", () => {
      const goToPage = vi.fn();

      const { result } = renderHook(() =>
        useReaderControls({
          currentPage: 2,
          totalPages: 10,
          nextChapter: vi.fn(),
          previousChapter: vi.fn(),
          nextPage: vi.fn(),
          previousPage: vi.fn(),
          goToPage,
        }),
      );

      act(() => {
        result.current.page.goTo(2.5);
      });

      expect(goToPage).not.toHaveBeenCalled();
    });
  });

  describe("page controls", () => {
    it("page.next calls nextPage", () => {
      const nextPage = vi.fn();

      const { result } = renderHook(() =>
        useReaderControls({
          currentPage: 2,
          totalPages: 10,
          nextChapter: vi.fn(),
          previousChapter: vi.fn(),
          nextPage,
          previousPage: vi.fn(),
          goToPage: vi.fn(),
        }),
      );

      act(() => {
        result.current.page.next();
      });

      expect(nextPage).toHaveBeenCalledTimes(1);
    });

    it("page.previous calls peviousPage", () => {
      const previousPage = vi.fn();

      const { result } = renderHook(() =>
        useReaderControls({
          currentPage: 2,
          totalPages: 10,
          nextChapter: vi.fn(),
          previousChapter: vi.fn(),
          nextPage: vi.fn(),
          previousPage,
          goToPage: vi.fn(),
        }),
      );

      act(() => {
        result.current.page.previous();
      });

      expect(previousPage).toHaveBeenCalledTimes(1);
    });
  });

  describe("Chapter  controls", () => {
    it("chapter.nextChapter calls nextChhapter", () => {
      const nextChapter = vi.fn();

      const { result } = renderHook(() =>
        useReaderControls({
          currentPage: 2,
          totalPages: 10,
          nextChapter,
          previousChapter: vi.fn(),
          nextPage: vi.fn(),
          previousPage: vi.fn(),
          goToPage: vi.fn(),
        }),
      );

      act(() => {
        result.current.chapter.nextChapter();
      });

      expect(nextChapter).toHaveBeenCalledTimes(1);
    });

    it("chapter.previousChapter calls previousChapter", () => {
      const previousChapter = vi.fn();

      const { result } = renderHook(() =>
        useReaderControls({
          currentPage: 2,
          totalPages: 10,
          nextChapter: vi.fn(),
          previousChapter,
          nextPage: vi.fn(),
          previousPage: vi.fn(),
          goToPage: vi.fn(),
        }),
      );
      act(() => {
        result.current.chapter.previousChapter();
      });

      expect(previousChapter).toHaveBeenCalledTimes(1);
    });
  });
});
