import { useEffect, useState, type FocusEvent, type ReactNode } from "react";
import { createPortal } from "react-dom";

interface TooltipProps {
  text: string;
  /** false = tooltip tidak dipasang (mis. sidebar sedang lebar, label sudah terlihat). */
  enabled?: boolean;
  children: ReactNode;
}

interface Anchor {
  top: number;
  left: number;
}

/**
 * Tooltip balon komik di kanan elemen, muncul saat hover atau fokus keyboard.
 * Dirender lewat portal dengan posisi `fixed`, jadi tidak membuat wadahnya bisa digeser
 * ke samping. Nama aksesibel tetap dari label elemennya, jadi balon disembunyikan dari pembaca layar.
 */
const Tooltip = ({ text, enabled = true, children }: TooltipProps) => {
  const [anchor, setAnchor] = useState<Anchor | null>(null);

  // Posisi dihitung saat muncul; bila wadah digulir, balon disembunyikan agar tidak tertinggal.
  useEffect(() => {
    if (!anchor) return;
    const hide = () => setAnchor(null);
    window.addEventListener("scroll", hide, true);
    window.addEventListener("resize", hide);
    return () => {
      window.removeEventListener("scroll", hide, true);
      window.removeEventListener("resize", hide);
    };
  }, [anchor]);

  if (!enabled) {
    // Sidebar baru saja dilebarkan: buang posisi lama agar tidak muncul lagi saat diciutkan.
    if (anchor) setAnchor(null);
    return <>{children}</>;
  }

  function show(el: HTMLElement) {
    const box = el.getBoundingClientRect();
    setAnchor({ top: box.top + box.height / 2, left: box.right + 14 });
  }

  return (
    <div
      onMouseEnter={(e) => show(e.currentTarget)}
      onMouseLeave={() => setAnchor(null)}
      onFocus={(e: FocusEvent<HTMLDivElement>) => (e.target as HTMLElement).matches(":focus-visible") && show(e.currentTarget)}
      onBlur={() => setAnchor(null)}
    >
      {children}
      {anchor &&
        createPortal(
          <span
            aria-hidden
            style={{ top: anchor.top, left: anchor.left }}
            className="pointer-events-none fixed z-[70] -translate-y-1/2"
          >
            <span className="relative block origin-left animate-gelembung rounded-[14px] border-2 border-brand-primary bg-neutral-surface px-3 py-1.5 text-xs font-semibold whitespace-nowrap text-brand-primary shadow-[3px_3px_0_0_var(--color-brand-primary)] motion-reduce:animate-none">
              {/* Ekor balon: persegi diputar 45° dengan garis kiri & bawah, menunjuk ke ikon. */}
              <span className="absolute top-1/2 -left-[7px] size-3 -translate-y-1/2 rotate-45 rounded-bl-[3px] border-b-2 border-l-2 border-brand-primary bg-neutral-surface" />
              <span className="relative">{text}</span>
            </span>
          </span>,
          document.body,
        )}
    </div>
  );
};

export default Tooltip;
