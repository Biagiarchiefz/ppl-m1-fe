import { useEffect, type RefObject } from "react";

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

interface FocusTrapOptions {
  active?: boolean;
  /** Selector wadah tempat fokus awal dicari dulu (mis. isi modal), sebelum elemen fokus pertama di panel. */
  initialFocusWithin?: string;
}

/**
 * Kurung fokus keyboard (Tab / Shift+Tab) di dalam `ref`. Saat aktif, fokus
 * dipindah ke elemen pertama; saat selesai, dikembalikan ke elemen pemicu.
 */
export function useFocusTrap(ref: RefObject<HTMLElement | null>, { active = true, initialFocusWithin }: FocusTrapOptions = {}) {
  useEffect(() => {
    const panel = ref.current;
    if (!active || !panel) return;
    const previous = document.activeElement as HTMLElement | null;

    const initial = initialFocusWithin ? panel.querySelector<HTMLElement>(`${initialFocusWithin} :is(${FOCUSABLE})`) : null;
    (initial ?? panel.querySelector<HTMLElement>(FOCUSABLE))?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const items = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((el) => el.offsetParent !== null);
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      previous?.focus?.();
    };
  }, [ref, active, initialFocusWithin]);
}
