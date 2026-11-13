// Tampil sebentar saat kode halaman (lazy-load) sedang diunduh.
const PageLoader = () => (
  <div role="status" aria-live="polite" className="grid min-h-dvh place-items-center bg-neutral-bg">
    <span className="flex items-center gap-3 text-sm text-text-muted">
      <span
        aria-hidden
        className="size-5 animate-spin rounded-full border-2 border-brand-primary border-t-transparent motion-reduce:animate-none"
      />
      Memuat halaman...
    </span>
  </div>
);

export default PageLoader;
