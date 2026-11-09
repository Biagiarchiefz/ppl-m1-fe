import { useEffect, useState } from "react";
import { KeyRound } from "lucide-react";
import AdminLayout from "../Admin/AdminLayout";
import Alert from "../../components/common/Alert/Alert";
import ChangePasswordModal from "../../features/auth/components/ChangePasswordModal";
import { ApiError } from "../../services/api";
import { getMe, type Me } from "../../features/auth";

function profileRows(me: Me): [string, string][] {
  return [
    ["Nama", me.name],
    ["Email", me.email],
    ["Organisasi", me.organization_name ?? "-"],
    ["Peran", me.role],
    ["Jumlah izin", String(me.permissions.length)],
    ["Divisi", me.division ?? "-"],
    ["Unit usaha", me.unit_usaha_id === null ? "-" : String(me.unit_usaha_id)],
  ];
}

// Detail profil dari GET /me (K-01), dibuka lewat ikon profil di navbar.
const ProfilePage = () => {
  const [me, setMe] = useState<Me | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);

  useEffect(() => {
    document.title = "Profil";
    getMe()
      .then(setMe)
      .catch((err) => setError(err instanceof ApiError ? err.message : "Terjadi kesalahan pada server"));
  }, []);

  function onPasswordSaved(message: string) {
    setChangingPassword(false);
    setNotice(message);
  }

  return (
    <AdminLayout>
      <div className="p-7">
        <h1 className="font-body text-[32px] font-semibold leading-10 text-text-default">Profil saya</h1>
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
          <button type="button" onClick={() => setChangingPassword(true)} className="mt-6 flex h-10 items-center justify-center gap-2 rounded-field bg-brand-primary px-4 text-sm font-semibold text-brand-on-primary hover:bg-brand-primary-strong">
            <KeyRound size={16} aria-hidden />
            Ubah kata sandi
          </button>
        </section>
      </div>

      {changingPassword && <ChangePasswordModal onClose={() => setChangingPassword(false)} onSaved={onPasswordSaved} />}
    </AdminLayout>
  );
};

export default ProfilePage;
