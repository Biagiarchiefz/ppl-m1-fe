import { ArrowLeft, type LucideIcon } from "lucide-react";
import Button from "../../../../components/common/Button/Button";
import { useErrorView } from "../../hooks/useErrorView";

interface ErrorViewProps {
  code: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

const ErrorView = ({ code, title, description, icon: Icon }: ErrorViewProps) => {
  const { goHome } = useErrorView();

  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-bg px-4">
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
            <Icon size={28} strokeWidth={1.8} aria-hidden />
          </div>
          <h1 className="mt-4 text-[40px] leading-none font-semibold tracking-[-0.02em] text-brand-primary tabular-nums">
            {code}
          </h1>
          <h2 className="mt-2 text-lg font-medium text-text-strong">
            {title}
          </h2>
          <p className="mt-2 text-xs leading-5 text-text-muted">{description}</p>
          <div className="my-4 h-px w-full bg-neutral-line" />
          <Button
            type="button"
            onClick={goHome}
            size="sm"
          >
            <ArrowLeft size={14} strokeWidth={2} aria-hidden />
            Kembali
          </Button>
        </div>
      </section>
    </main>
  );
};

export default ErrorView;
