import { KeyRound } from "lucide-react";
import Alert from "../../../../components/common/Alert/Alert";
import ChangePasswordModal from "../ChangePasswordModal";
import { profileRows, useProfile } from "../../hooks/useProfile";

const Profile = () => {
  const { me, error, notice, changingPassword, setChangingPassword, onPasswordSaved } = useProfile();

  return (
    <>
      <div>
        <h1 className="text-2xl leading-tight font-medium text-text-strong">Profil saya</h1>
        <p className="mt-1 text-sm leading-[22px] text-text-muted">Informasi akun Anda.</p>

        {notice && <div className="mt-4 max-w-[560px]"><Alert tone="success">{notice}</Alert></div>}
        {error && <div className="mt-4 max-w-[560px]"><Alert>{error}</Alert></div>}

        <section className="mt-6 max-w-[560px] rounded-card border border-neutral-line bg-neutral-surface p-6 shadow-card">
          {!me && !error && <p className="text-sm text-text-muted">Memuat profil...</p>}
          {me && (
            <dl className="divide-y divide-neutral-line">
              {profileRows(me).map(([label, value]) => (
                <div key={label} className="flex justify-between gap-4 py-2.5 text-sm">
                  <dt className="text-text-muted">{label}</dt>
                  <dd className="text-right font-semibold text-text-default">{value}</dd>
                </div>
              ))}
            </dl>
          )}
          <button type="button" onClick={() => setChangingPassword(true)} className="mt-6 flex min-h-10 items-center justify-center gap-2 rounded-full efek-tekan bg-brand-primary px-5 text-sm font-medium text-brand-on-primary hover:bg-brand-primary-strong">
            <KeyRound size={16} aria-hidden />
            Ubah kata sandi
          </button>
        </section>
      </div>

      {changingPassword && <ChangePasswordModal onClose={() => setChangingPassword(false)} onSaved={onPasswordSaved} />}
    </>
  );
};

export default Profile;
