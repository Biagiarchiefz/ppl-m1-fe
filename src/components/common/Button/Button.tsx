import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "subtle" | "danger" | "ghost";
type ButtonSize = "sm" | "md";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Tampilkan spinner dan nonaktifkan tombol. */
  loading?: boolean;
}

// Semua tombol berbentuk pil, tinggi minimum 44px, maksimal satu tombol utama per bagian.
// `group`: ikon panah di dalam tombol bisa bergeser saat hover (group-hover:translate-x-0.5).
const BASE =
  "group inline-flex items-center justify-center gap-2 rounded-full font-medium efek-tekan disabled:cursor-not-allowed disabled:opacity-60";

const variantClasses: Record<Exclude<ButtonVariant, "ghost">, string> = {
  primary: "w-full bg-brand-primary text-brand-on-primary hover:bg-brand-primary-strong",
  secondary: "border border-neutral-line-strong bg-neutral-surface text-text-default hover:bg-neutral-soft",
  subtle: "text-text-default hover:bg-neutral-recessed",
  danger: "bg-danger text-white hover:bg-danger/90 dark:text-neutral-bg",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "min-h-10 px-4 text-sm",
  md: "min-h-11 px-6 text-sm",
};

// Tombol ikon kecil (mis. lihat kata sandi di dalam input).
const GHOST =
  "flex size-8 shrink-0 items-center justify-center rounded-md text-text-subtle efek-tekan hover:text-text-default";

const Button = ({ variant = "primary", size = "md", loading = false, className = "", disabled, children, ...props }: ButtonProps) => {
  const classes =
    variant === "ghost" ? GHOST : `${BASE} ${variantClasses[variant]} ${sizeClasses[size]}`;

  return (
    <button
      {...props}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={`${classes} ${className}`.trim()}
    >
      {loading && (
        <span aria-hidden className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
      {children}
    </button>
  );
};

export default Button;
