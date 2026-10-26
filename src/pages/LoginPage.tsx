import { useState, type FormEvent } from "react";
import blobTl from "../assets/login/blob-tl.svg";
import blobTr from "../assets/login/blob-tr.svg";
import blobCenter from "../assets/login/blob-center.svg";
import blobBl from "../assets/login/blob-bl.svg";
import blobBr from "../assets/login/blob-br.svg";
import blobMidAccent from "../assets/login/blob-mid-accent.svg";
import divider from "../assets/login/divider.svg";
import decoCircle1 from "../assets/login/deco-circle-1.svg";
import decoCircle2 from "../assets/login/deco-circle-2.svg";
import iconMail from "../assets/login/icon-mail.svg";
import iconLock from "../assets/login/icon-lock.svg";
import iconEye from "../assets/login/icon-eye.svg";

// Posisi blob mengikuti frame desain 1440×900, dikonversi ke persen agar ikut melebar.
const blobs = [
  { src: blobTl, className: "left-[-13.89%] top-[-22.22%] h-[700px] w-[780px]", inset: "inset-[-17.14%_-15.38%]" },
  { src: blobTr, className: "left-[62.5%] top-[-20%] h-[620px] w-[700px]", inset: "inset-[-16.13%_-14.29%]" },
  { src: blobCenter, className: "left-[19.44%] top-[22.22%] h-[600px] w-[880px]", inset: "inset-[-23.33%_-15.91%]" },
  { src: blobBl, className: "left-[-11.11%] top-[62.22%] h-[560px] w-[720px]", inset: "inset-[-19.64%_-15.28%]" },
  { src: blobBr, className: "left-[65.28%] top-[57.78%] h-[560px] w-[680px]", inset: "inset-[-21.43%_-17.65%]" },
  { src: blobMidAccent, className: "left-[34.72%] top-[-11.11%] h-[480px] w-[500px]", inset: "inset-[-27.08%_-26%]" },
];

export default function LoginPage() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // TODO: sambungkan ke API autentikasi
    console.log({ identifier, password, remember });
  }

  return (
    <main className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-linear-to-r from-neutral-bg to-brand-primary-soft px-4 py-12">
      {blobs.map((blob) => (
        <div key={blob.src} aria-hidden className={`pointer-events-none absolute ${blob.className}`}>
          <div className={`absolute ${blob.inset}`}>
            <img alt="" className="block size-full max-w-none" src={blob.src} />
          </div>
        </div>
      ))}

      <div className="relative flex w-full max-w-[880px] flex-col overflow-clip rounded-card border border-neutral-line bg-neutral-surface shadow-card md:flex-row">
        {/* Panel kiri */}
        <div className="flex flex-col justify-center gap-6 p-8 sm:p-12 md:w-1/2">
          <div className="flex flex-col gap-2">
            <h1 className="font-heading text-[28px] leading-9 font-bold text-text-default">
              Masuk ke akun Anda
            </h1>
            <p className="text-base leading-6 text-text-muted">
              Gunakan akun yang telah terdaftar untuk melanjutkan.
            </p>
          </div>

          <img alt="" aria-hidden className="block h-px w-full" src={divider} />

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="identifier" className="text-sm leading-5 font-semibold text-text-default">
                Email atau nama pengguna
              </label>
              <div className="flex h-10 items-center gap-3 rounded-field border border-neutral-line-strong bg-neutral-surface px-3 focus-within:border-brand-primary focus-within:ring-2 focus-within:ring-brand-primary/20">
                <span className="flex size-5 shrink-0 items-center justify-center">
                  <img alt="" aria-hidden src={iconMail} />
                </span>
                <input
                  id="identifier"
                  name="identifier"
                  type="text"
                  autoComplete="username"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="Masukkan email atau nama pengguna"
                  className="min-w-0 flex-1 bg-transparent text-sm leading-[22px] text-text-default outline-none placeholder:text-text-muted"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="text-sm leading-5 font-semibold text-text-default">
                Kata sandi
              </label>
              <div className="flex h-10 items-center gap-3 rounded-field border border-neutral-line-strong bg-neutral-surface px-3 focus-within:border-brand-primary focus-within:ring-2 focus-within:ring-brand-primary/20">
                <span className="flex size-5 shrink-0 items-center justify-center">
                  <img alt="" aria-hidden src={iconLock} />
                </span>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan kata sandi"
                  className="min-w-0 flex-1 bg-transparent text-sm leading-[22px] text-text-default outline-none placeholder:text-text-muted"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                  aria-pressed={showPassword}
                  className={`flex size-5 shrink-0 cursor-pointer items-center justify-center rounded-sm transition-opacity ${showPassword ? "opacity-100" : "opacity-80 hover:opacity-100"}`}
                >
                  <img alt="" aria-hidden src={iconEye} />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="peer sr-only"
                />
                <span className="flex size-4 items-center justify-center rounded-[4px] border border-[#757575] bg-white peer-checked:border-[#2c2c2c] peer-checked:bg-[#2c2c2c] peer-focus-visible:ring-2 peer-focus-visible:ring-brand-primary/40 [&>svg]:invisible peer-checked:[&>svg]:visible">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                    <path d="M13.3333 4L5.99996 11.3333L2.66663 8" stroke="#F5F5F5" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <span className="font-inter text-base leading-[1.4] text-[#1e1e1e]">Ingat saya</span>
              </label>

              <a href="#" className="text-sm leading-[22px] text-brand-primary hover:underline">
                Lupa kata sandi?
              </a>
            </div>

            <button
              type="submit"
              className="w-full cursor-pointer rounded-field bg-brand-primary p-3 text-sm leading-[22px] font-bold text-brand-on-primary transition-colors hover:bg-[#1a3567] focus-visible:ring-2 focus-visible:ring-brand-primary/40 focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              Masuk
            </button>
          </form>
        </div>

        {/* Panel kanan */}
        <div className="relative flex flex-col justify-center gap-6 overflow-clip bg-brand-primary p-8 sm:p-12 md:w-1/2">
          <img alt="" aria-hidden className="absolute top-[-80px] left-[280px] size-[220px]" src={decoCircle1} />
          <img alt="" aria-hidden className="absolute top-[260px] left-[320px] size-[180px]" src={decoCircle2} />
          <div className="relative flex flex-col gap-6 text-brand-on-primary">
            <p className="font-heading text-[32px] leading-10 font-extrabold">Selamat datang kembali.</p>
            <p className="text-base leading-6 opacity-85">
              Belum punya akun? Hubungi administrator unit Anda untuk dibuatkan akun beserta perannya.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
