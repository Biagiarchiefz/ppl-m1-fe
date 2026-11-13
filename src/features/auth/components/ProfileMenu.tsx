import { useEffect, useRef, useState } from "react";
import { ChevronDown, LogOut, UserRound } from "lucide-react";
import { useNavigate } from "react-router";
import type { SessionUser } from "../auth.Slice";

interface ProfileMenuProps {
  user: SessionUser | null;
  onLogout: () => void;
}

/** Ikon profil di kanan navbar: avatar inisial + menu Profil saya / Keluar. */
const ProfileMenu = ({ user, onLogout }: ProfileMenuProps) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const name = user?.name ?? "Pengguna";
  const initial = (name.trim()[0] ?? "A").toUpperCase();

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const itemClass =
    "flex min-h-10 w-full items-center gap-2.5 rounded-lg px-3 text-left text-sm font-medium efek-tekan";

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Menu akun ${name}`}
        className="flex min-h-10 items-center gap-2 rounded-full py-1 pr-1 pl-1 efek-tekan hover:bg-neutral-recessed sm:pr-2.5"
      >
        <span aria-hidden className="grid size-8 place-items-center rounded-full bg-brand-primary text-sm font-semibold text-brand-on-primary">
          {initial}
        </span>
        <span className="hidden max-w-40 truncate text-sm font-medium text-text-strong sm:inline">{name}</span>
        <ChevronDown
          size={16}
          strokeWidth={1.5}
          aria-hidden
          className={`hidden text-text-subtle transition-transform duration-150 sm:block ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute top-full right-0 z-50 mt-2 w-64 animate-muncul rounded-card border border-neutral-line bg-neutral-surface p-1.5 shadow-pop motion-reduce:animate-none"
        >
          <div className="flex items-center gap-3 border-b border-neutral-line-soft px-3 pt-2 pb-3">
            <span aria-hidden className="grid size-10 shrink-0 place-items-center rounded-full bg-brand-primary text-base font-semibold text-brand-on-primary">
              {initial}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-text-strong">{name}</p>
              {user?.role && (
                <span className="mt-0.5 inline-block max-w-full truncate rounded-full bg-brand-primary-soft px-2 text-xs leading-5 font-medium text-link">
                  {user.role}
                </span>
              )}
            </div>
          </div>
          <div className="pt-1.5">
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setOpen(false);
                navigate("/profile");
              }}
              className={`${itemClass} text-text-default hover:bg-neutral-soft`}
            >
              <UserRound size={16} strokeWidth={1.5} aria-hidden />
              Profil saya
            </button>
            <button
              type="button"
              role="menuitem"
              onClick={onLogout}
              className={`${itemClass} text-danger hover:bg-danger-soft`}
            >
              <LogOut size={16} strokeWidth={1.5} aria-hidden />
              Keluar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileMenu;
