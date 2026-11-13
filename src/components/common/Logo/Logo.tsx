interface LogoProps {
  /** Teks putih untuk dipakai di atas pita biru tua / foto. */
  light?: boolean;
  /** Sembunyikan nama, tampilkan ikon saja (mis. sidebar yang diciutkan). */
  iconOnly?: boolean;
  className?: string;
}

/** Ikon hub buatan sendiri: satu simpul pusat yang terhubung ke tiga unit. */
export const LogoMark = ({ className = "size-7" }: { className?: string }) => (
  <svg viewBox="0 0 32 32" aria-hidden className={`shrink-0 ${className}`}>
    <rect width="32" height="32" rx="8" fill="#1f3f7a" />
    <path d="M16 16 9.5 10M16 16l7-4.5M16 16v7.5" stroke="#a8c3f5" strokeWidth="2" strokeLinecap="round" />
    <circle cx="16" cy="16" r="3.6" fill="#fff" />
    <circle cx="9.5" cy="10" r="2.3" fill="#fff" />
    <circle cx="23" cy="11.5" r="2.3" fill="#8fb0ee" />
    <circle cx="16" cy="23.5" r="2.3" fill="#fff" />
  </svg>
);

const Logo = ({ light = false, iconOnly = false, className = "" }: LogoProps) => (
  <span className={`inline-flex min-w-0 items-center gap-2.5 ${className}`}>
    <LogoMark className={`size-7 ${light ? "ring-1 ring-white/20 rounded-lg" : ""}`} />
    <span className={iconOnly ? "sr-only" : `truncate text-lg font-medium ${light ? "text-text-on-dark" : "text-text-strong"}`}>
      Araya Business Hub
    </span>
  </span>
);

export default Logo;
