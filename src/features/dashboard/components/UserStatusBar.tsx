interface UserStatusBarProps {
  total: number | null;
  active: number | null;
}

/** Batang bertumpuk pengguna aktif vs nonaktif + legenda. */
const UserStatusBar = ({ total, active }: UserStatusBarProps) => {
  if (total === null || active === null) return null;
  const inactive = Math.max(total - active, 0);
  const percent = total > 0 ? Math.round((active / total) * 100) : 0;

  return (
    <section aria-labelledby="judul-status" className="rounded-card border border-neutral-line bg-neutral-surface p-4">
      <div className="flex items-baseline justify-between gap-3">
        <h2 id="judul-status" className="text-sm font-semibold text-text-strong">
          Status akun pengguna
        </h2>
        <p className="text-xs text-text-muted tabular-nums">{percent}% aktif</p>
      </div>
      <div
        role="img"
        aria-label={`Aktif ${active}, nonaktif ${inactive}`}
        className="mt-3 flex h-2 overflow-hidden rounded-full bg-neutral-recessed"
      >
        {total > 0 && <span className="bg-brand-primary" style={{ width: `${percent}%` }} />}
      </div>
      <ul className="mt-2.5 grid grid-cols-2 gap-x-4 text-xs text-text-muted">
        <li className="flex items-center gap-2">
          <span aria-hidden className="size-2 shrink-0 rounded-full bg-brand-primary" />
          Aktif
          <span className="ml-auto font-medium text-text-strong tabular-nums">{active}</span>
        </li>
        <li className="flex items-center gap-2">
          <span aria-hidden className="size-2 shrink-0 rounded-full bg-neutral-line-strong" />
          Nonaktif
          <span className="ml-auto font-medium text-text-strong tabular-nums">{inactive}</span>
        </li>
      </ul>
    </section>
  );
};

export default UserStatusBar;
