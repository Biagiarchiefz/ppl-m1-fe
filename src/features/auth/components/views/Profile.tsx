import { Building2, FolderTree, Hash, KeyRound, ShieldCheck, Store, type LucideIcon } from "lucide-react";
import Alert from "../../../../components/common/Alert/Alert";
import Button from "../../../../components/common/Button/Button";
import ChangePasswordModal from "../ChangePasswordModal";
import { initialOf, profileDetails, useProfile, type ProfileDetailKey } from "../../hooks/useProfile";

const DETAIL_ICONS: Record<ProfileDetailKey, LucideIcon> = {
  division: FolderTree,
  partner: Building2,
  unit: Store,
  user: Hash,
};

// Kerangka saat profil dimuat, ukurannya sama dengan isi aslinya.
const ProfileSkeleton = () => (
  <div aria-hidden className="animate-pulse">
    <div className="flex items-center gap-4 p-5">
      <span className="size-14 shrink-0 rounded-full bg-neutral-recessed" />
      <div className="flex-1 space-y-2">
        <span className="block h-4 w-40 rounded bg-neutral-recessed" />
        <span className="block h-3 w-24 rounded bg-neutral-recessed" />
      </div>
    </div>
    <div className="grid grid-cols-2 gap-px border-t border-neutral-line bg-neutral-line sm:grid-cols-4">
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="space-y-2 bg-neutral-surface px-5 py-4">
          <span className="block h-3 w-16 rounded bg-neutral-recessed" />
          <span className="block h-4 w-20 rounded bg-neutral-recessed" />
        </div>
      ))}
    </div>
  </div>
);

const Profile = () => {
  const { me, error, changingPassword, setChangingPassword, onPasswordSaved } = useProfile();

  return (
    <>
      <div className="max-w-3xl">
        <h1 className="text-2xl leading-tight font-medium text-text-strong">Profil saya</h1>
        <p className="mt-1 text-sm text-text-muted">Informasi akun dan keamanan login Anda.</p>
        {error && <div className="mt-4"><Alert>{error}</Alert></div>}

        <section aria-label="Informasi akun" className="mt-5 overflow-hidden rounded-card border border-neutral-line bg-neutral-surface shadow-card">
          {!me && !error && <ProfileSkeleton />}
          {me && (
            <>
              {/* Identitas: avatar inisial, nama, dan peran. */}
              <div className="flex items-center gap-4 p-5">
                <span aria-hidden className="grid size-14 shrink-0 place-items-center rounded-full bg-brand-primary text-xl font-semibold text-brand-on-primary ring-4 ring-brand-primary-soft">
                  {initialOf(me.name)}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-lg leading-tight font-semibold text-text-strong">{me.name}</p>
                  <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                    <span className="rounded-full bg-brand-primary-soft px-2.5 py-0.5 text-xs font-medium text-link">{me.role}</span>
                    {me.is_super_admin && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-success-soft px-2.5 py-0.5 text-xs font-medium text-success">
                        <ShieldCheck size={12} strokeWidth={2} aria-hidden />
                        Super admin
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Rincian akun: garis pemisah dibentuk dari gap-px di atas latar garis. */}
              <dl className="grid grid-cols-2 gap-px border-t border-neutral-line bg-neutral-line sm:grid-cols-4">
                {profileDetails(me).map(({ key, label, value }) => {
                  const Icon = DETAIL_ICONS[key];
                  return (
                    <div key={key} className="bg-neutral-surface px-5 py-4">
                      <dt className="flex items-center gap-1.5 text-xs text-text-subtle">
                        <Icon size={14} strokeWidth={1.5} aria-hidden />
                        {label}
                      </dt>
                      <dd className="mt-1 truncate text-sm font-semibold text-text-default tabular-nums">{value}</dd>
                    </div>
                  );
                })}
              </dl>
            </>
          )}
        </section>

        <section aria-labelledby="judul-keamanan" className="mt-3 flex flex-wrap items-center gap-4 rounded-card border border-neutral-line bg-neutral-surface p-5 shadow-card">
          <span aria-hidden className="grid size-10 shrink-0 place-items-center rounded-lg bg-brand-primary-soft text-brand-primary">
            <KeyRound size={18} strokeWidth={1.5} />
          </span>
          <div className="min-w-0 flex-1">
            <h2 id="judul-keamanan" className="text-sm font-semibold text-text-strong">Kata sandi</h2>
            <p className="mt-0.5 text-xs text-text-muted">Ganti secara berkala dengan kombinasi huruf dan angka.</p>
          </div>
          <Button type="button" variant="secondary" size="sm" onClick={() => setChangingPassword(true)}>
            Ubah kata sandi
          </Button>
        </section>
      </div>

      {changingPassword && <ChangePasswordModal onClose={() => setChangingPassword(false)} onSaved={onPasswordSaved} />}
    </>
  );
};

export default Profile;
