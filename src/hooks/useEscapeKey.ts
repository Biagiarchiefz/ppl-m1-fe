import { useEffect, useRef } from "react";

/** Jalankan `onEscape` saat tombol Escape ditekan, selama `active` bernilai true. */
export function useEscapeKey(onEscape: () => void, active = true) {
  // Simpan handler terbaru di ref agar listener tidak dipasang ulang tiap render.
  const handlerRef = useRef(onEscape);
  useEffect(() => {
    handlerRef.current = onEscape;
  }, [onEscape]);

  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handlerRef.current();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active]);
}
