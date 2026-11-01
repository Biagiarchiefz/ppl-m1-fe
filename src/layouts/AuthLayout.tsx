import { useEffect, type ReactNode } from "react";
import blobBl from "../assets/login/blob-bl.svg";
import blobBr from "../assets/login/blob-br.svg";
import blobCenter from "../assets/login/blob-center.svg";
import blobMidAccent from "../assets/login/blob-mid-accent.svg";
import blobTl from "../assets/login/blob-tl.svg";
import blobTr from "../assets/login/blob-tr.svg";
import decoCircle1 from "../assets/login/deco-circle-1.svg";
import decoCircle2 from "../assets/login/deco-circle-2.svg";

interface AuthLayoutProps {
  title: string;
  children: ReactNode;
  sideTitle?: string;
  sideDescription?: string;
}

const blobs = [
  [blobTl, "left-[-13.89%] top-[-22.22%] h-[700px] w-[780px]", "inset-[-17.14%_-15.38%]"],
  [blobTr, "left-[62.5%] top-[-20%] h-[620px] w-[700px]", "inset-[-16.13%_-14.29%]"],
  [blobCenter, "left-[19.44%] top-[22.22%] h-[600px] w-[880px]", "inset-[-23.33%_-15.91%]"],
  [blobBl, "left-[-11.11%] top-[62.22%] h-[560px] w-[720px]", "inset-[-19.64%_-15.28%]"],
  [blobBr, "left-[65.28%] top-[57.78%] h-[560px] w-[680px]", "inset-[-21.43%_-17.65%]"],
  [blobMidAccent, "left-[34.72%] top-[-11.11%] h-[480px] w-[500px]", "inset-[-27.08%_-26%]"],
] as const;

const AuthLayout = ({
  title,
  children,
  sideTitle = "Selamat datang.",
  sideDescription = "Gunakan aplikasi dengan mudah dan aman.",
}: AuthLayoutProps) => {
  useEffect(() => {
    document.title = title;
  }, [title]);

  return (
    <main className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-linear-to-r from-neutral-bg to-brand-primary-soft px-4 py-12">
    {blobs.map(([src, className, inset]) => (
      <div key={src} aria-hidden className={`pointer-events-none absolute ${className}`}>
        <div className={`absolute ${inset}`}>
          <img alt="" className="block size-full max-w-none" src={src} />
        </div>
      </div>
    ))}

    <div className="relative flex w-full max-w-[880px] flex-col overflow-clip rounded-card border border-neutral-line bg-neutral-surface shadow-card md:flex-row">
      <div className="flex flex-col justify-center gap-6 p-8 sm:p-12 md:w-1/2">
        {children}
      </div>

      <div className="relative flex flex-col justify-center gap-6 overflow-clip bg-brand-primary p-8 sm:p-12 md:w-1/2">
        <img alt="" aria-hidden className="absolute top-[-80px] left-[280px] size-[220px]" src={decoCircle1} />
        <img alt="" aria-hidden className="absolute top-[260px] left-[320px] size-[180px]" src={decoCircle2} />
        <div className="relative flex flex-col gap-6 text-brand-on-primary">
          <p className="font-heading text-[32px] leading-10 font-extrabold">{sideTitle}</p>
          <p className="text-base leading-6 opacity-85">{sideDescription}</p>
        </div>
      </div>
    </div>
    </main>
  );
};

export default AuthLayout;
