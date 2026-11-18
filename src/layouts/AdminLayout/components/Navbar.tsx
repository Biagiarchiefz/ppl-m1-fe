import { ChevronRight, Menu } from "lucide-react";
import Logo from "../../../components/common/Logo/Logo";
import ThemeToggle from "../../../components/common/ThemeToggle/ThemeToggle";
import ProfileMenu from "../../../features/auth/components/ProfileMenu";
import type { ActivePage, SessionUser } from "../../../types";

interface NavbarProps {
  user: SessionUser | null;
  page: ActivePage | null;
  drawerOpen: boolean;
  onOpenDrawer: () => void;
  onLogout: () => void;
}

/** Navbar 64px: tinggi & garis bawahnya sejajar header sidebar, jadi keduanya tampak menyatu. */
const Navbar = ({ user, page, drawerOpen, onOpenDrawer, onLogout }: NavbarProps) => (
  <header className="sticky top-0 z-40 h-16 shrink-0 border-b border-neutral-line bg-neutral-surface">
    <div className="flex h-full items-center gap-2 px-4 sm:px-6 lg:px-8">
      {/* Ponsel & tablet: tombol laci menu + logo. */}
      <button
        type="button"
        onClick={onOpenDrawer}
        aria-haspopup="dialog"
        aria-expanded={drawerOpen}
        aria-label="Buka menu"
        className="-ml-2 grid size-11 place-items-center rounded-full text-text-default efek-tekan hover:bg-neutral-recessed lg:hidden"
      >
        <Menu size={24} strokeWidth={1.5} aria-hidden />
      </button>
      <span className="min-w-0 lg:hidden">
        <span className="sm:hidden">
          <Logo iconOnly />
        </span>
        <span className="hidden sm:block">
          <Logo className="[&>span:last-child]:text-base" />
        </span>
      </span>

      {/* Desktop: breadcrumb halaman aktif. */}
      {page && (
        <nav aria-label="Lokasi halaman" className="hidden min-w-0 items-center gap-1.5 text-sm lg:flex">
          <span className="text-text-subtle">{page.section}</span>
          <ChevronRight size={14} strokeWidth={1.5} aria-hidden className="shrink-0 text-text-subtle" />
          <span aria-current="page" className="truncate font-medium text-text-strong">
            {page.label}
          </span>
        </nav>
      )}

      <div className="ml-auto flex shrink-0 items-center gap-1 sm:gap-2">
        <ThemeToggle />
        <span aria-hidden className="mx-1 hidden h-6 w-px bg-neutral-line sm:block" />
        <ProfileMenu user={user} onLogout={onLogout} />
      </div>
    </div>
  </header>
);

export default Navbar;
