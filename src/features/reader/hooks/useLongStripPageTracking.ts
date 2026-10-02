import { useCallback, useEffect, useRef } from "react";

import type { Virtualizer } from "@tanstack/react-virtual";

type UseLongStripPageTrackingProps = {
  enabled: boolean;
  root: HTMLElement | null;
  virtualizer: Virtualizer<HTMLElement, Element>;
  onPageChange: (page: number) => void;
};

export function useLongStripPageTracking({
  enabled,
  root,
  virtualizer,
  onPageChange,
}: UseLongStripPageTrackingProps) {
  const rafRef = useRef<number | null>(null);

  const lastPageRef = useRef<number | null>(null);

  const programmaticNavigationRef = useRef(false);

  const updateCurrentPage = useCallback(() => {
    if (!enabled) {
      return;
    }

    if (!root) {
      return;
    }

    if (programmaticNavigationRef.current) {
      return;
    }

    const viewportCenter = root.scrollTop + root.clientHeight / 2;

    const virtualItems = virtualizer.getVirtualItems();

    if (virtualItems.length === 0) {
      return;
    }

    let closestIndex = virtualItems[0].index;

    let closestDistance = Infinity;

    for (const item of virtualItems) {
      if (viewportCenter >= item.start && viewportCenter < item.end) {
        closestIndex = item.index;

        closestDistance = 0;

        break;
      }

      const itemCenter = item.start + item.size / 2;

      const distance = Math.abs(itemCenter - viewportCenter);

      if (distance < closestDistance) {
        closestDistance = distance;

        closestIndex = item.index;
      }
    }

    if (lastPageRef.current === closestIndex) {
      return;
    }

    lastPageRef.current = closestIndex;

    onPageChange(closestIndex);
  }, [enabled, onPageChange, root, virtualizer]);

  const setProgrammaticNavigation = useCallback(
    (value: boolean) => {
      programmaticNavigationRef.current = value;
      if (!value) {
        updateCurrentPage();
      }
    },
    [updateCurrentPage],
  );

  const handleScroll = useCallback(() => {
    if (rafRef.current !== null) {
      return;
    }

    rafRef.current = window.requestAnimationFrame(() => {
      rafRef.current = null;

      updateCurrentPage();
    });
  }, [updateCurrentPage]);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    if (!root) {
      return;
    }

    root.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    const initialRaf = window.requestAnimationFrame(() => {
      updateCurrentPage();
    });

    return () => {
      root.removeEventListener("scroll", handleScroll);

      window.cancelAnimationFrame(initialRaf);

      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);

        rafRef.current = null;
      }
    };
  }, [enabled, handleScroll, root, updateCurrentPage]);

  useEffect(() => {
    lastPageRef.current = null;
  }, [enabled, root]);

  return {
    setProgrammaticNavigation,
  };
}
