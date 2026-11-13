import { useEffect, type ReactNode } from "react";
import Logo from "../components/common/Logo/Logo";
import ThemeToggle from "../components/common/ThemeToggle/ThemeToggle";
import { AUTH_PHOTO, unsplashSrcSet, unsplashUrl } from "../utils/unsplash";

interface AuthLayoutProps {
  title: string;
  children: ReactNode;
  sideTitle?: string;
  sideDescription?: string;
}

/** Foto ruang kerja + gradien biru tua agar teks di atasnya tetap terbaca. */
const Photo = ({ sizes }: { sizes: string }) => (
  <>
    <img
      src={unsplashUrl(AUTH_PHOTO.id, 1200)}
      srcSet={unsplashSrcSet(AUTH_PHOTO.id)}
      sizes={sizes}
      alt=""
      className="absolute inset-0 size-full object-cover"
    />
    <span aria-hidden className="absolute inset-0 bg-linear-to-t from-band-deep via-band-deep/70 to-band-deep/30" />
  </>
);

const AuthLayout = ({
  title,
  children,
  sideTitle = "Kelola pengguna, peran, dan akses unit usaha dari satu tempat.",
  sideDescription = "Setiap perubahan akses tercatat di audit log, sehingga tim selalu tahu siapa mengubah apa dan kapan.",
}: AuthLayoutProps) => {
  useEffect(() => {
    document.title = title;
  }, [title]);

  return (
    <div className="grid min-h-dvh bg-neutral-surface lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
      {/* Desktop: panel foto di kiri dengan logo dan pesan utama. */}
      <aside className="relative hidden overflow-hidden bg-band-deep lg:block">
        <Photo sizes="50vw" />
        <div className="relative flex h-full flex-col justify-between p-10 xl:p-14">
          <Logo light />
          <div>
            <p className="max-w-md text-[28px] leading-[1.2] font-medium tracking-[-0.015em] text-balance text-text-on-dark">
              {sideTitle}
            </p>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-text-on-dark-muted">{sideDescription}</p>
          </div>
        </div>
      </aside>

      <main id="konten" className="flex flex-col px-4 py-6 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between gap-3">
          <span className="lg:hidden">
            <Logo />
          </span>
          <ThemeToggle className="ml-auto text-text-muted hover:bg-neutral-recessed hover:text-text-strong" />
        </div>

        <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center py-8">
          {/* Ponsel & tablet: foto ringkas di atas form. */}
          <div className="relative mb-8 flex h-36 items-end overflow-hidden rounded-card bg-band-deep p-4 lg:hidden">
            <Photo sizes="(min-width: 640px) 384px, 100vw" />
            <p className="relative text-sm leading-snug font-medium text-text-on-dark">{sideTitle}</p>
          </div>
          <div className="animate-muncul motion-reduce:animate-none">{children}</div>
        </div>

        <p className="text-center text-xs text-text-subtle">
          © {new Date().getFullYear()} Araya Business Hub
        </p>
      </main>
    </div>
  );
};

export default AuthLayout;
