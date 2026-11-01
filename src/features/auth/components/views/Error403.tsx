import { ArrowLeft, ShieldOff } from "lucide-react";
import { useNavigate } from "react-router";
import Button from "../../../../components/common/Button/Button";

const Error403 = () => {
  const navigate = useNavigate();

  return (
    <main className="flex min-h-screen items-center justify-center bg-linear-to-br from-neutral-bg to-brand-primary-soft px-4">
      <section className="relative w-full max-w-[288px] overflow-hidden rounded-card border border-neutral-line bg-neutral-surface px-6 py-7 text-center shadow-card sm:max-w-[360px] sm:px-8">
        <div
          aria-hidden
          className="absolute -top-10 -right-10 size-28 rounded-full bg-brand-primary-soft"
        />
        <div
          aria-hidden
          className="absolute -bottom-12 -left-12 size-28 rounded-full bg-brand-primary-soft"
        />

        <div className="relative flex flex-col items-center">
          <div className="flex size-14 items-center justify-center rounded-full bg-brand-primary-soft text-brand-primary">
            <ShieldOff size={28} strokeWidth={1.8} aria-hidden />
          </div>
          <h1 className="mt-4 font-heading text-[32px] leading-10 font-bold text-brand-primary">
            403
          </h1>
          <h2 className="mt-1 font-heading text-lg font-bold text-text-default">
            Forbidden Access
          </h2>
          <p className="mt-2 text-xs leading-5 text-text-muted">
            Anda tidak memiliki izin untuk mengakses halaman ini. Silakan
            hubungi administrator jika Anda merasa ini adalah kesalahan.
          </p>
          <div className="my-4 h-px w-full bg-neutral-line" />
          <Button
            type="button"
            onClick={() => navigate("/login")}
            className="flex h-9 items-center justify-center gap-2 p-2 text-xs"
          >
            <ArrowLeft size={14} strokeWidth={2} aria-hidden />
            Kembali
          </Button>
        </div>
      </section>
    </main>
  );
};

export default Error403;
