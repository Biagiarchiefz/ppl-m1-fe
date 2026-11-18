import { useEffect } from "react";

/** Kunci gulir halaman di belakang dialog/laci selama `active` bernilai true. */
export function useScrollLock(active = true) {
  useEffect(() => {
    if (!active) return;
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = previous;
    };
  }, [active]);
}
