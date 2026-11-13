import { useEffect, useState } from "react";
import { Lock, Plus } from "lucide-react";
import AdminLayout from "./AdminLayout";
import Alert from "../../components/common/Alert/Alert";
import Pagination from "../../components/common/Pagination/Pagination";
import ConfirmDialog from "../../components/common/ConfirmDialog/ConfirmDialog";
import RoleFormModal from "../../features/roles/components/RoleFormModal";
import { activateRole, deactivateRole, listPermissions, listRoles, type Permission, type Role } from "../../features/roles";
import { useAsync } from "../../hooks/useAsync";

type Dialog = { kind: "create" } | { kind: "edit"; role: Role } | { kind: "deactivate" | "activate"; role: Role } | null;

// Peran milik organisasi beserta izinnya. Peran "administrator" bawaan
// otomatis memiliki semua izin dan tidak dapat diubah.
const RolesPage = () => {
  const [page, setPage] = useState(1);
  const [reloadKey, setReloadKey] = useState(0);
  const [dialog, setDialog] = useState<Dialog>(null);
  const [notice, setNotice] = useState("");
  const [permissions, setPermissions] = useState<Permission[]>([]);

  useEffect(() => {
    document.title = "Peran & Izin";
    listPermissions().then((r) => setPermissions(r.data)).catch(() => setPermissions([]));
  }, []);

  const { data, error, loading } = useAsync(listRoles, { page }, reloadKey);
  const roles = data?.data ?? [];

  function onSaved(message: string) {
    setDialog(null);
    setNotice(message);
    setReloadKey((k) => k + 1);
  }

  return (
    <AdminLayout>
      <div>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl leading-tight font-medium text-text-strong">Peran &amp; Izin</h1>
            <p className="mt-1 text-sm leading-[22px] text-text-muted">Atur peran sesuai struktur organisasi dan pilih izin untuk tiap peran.</p>
          </div>
          <button type="button" onClick={() => setDialog({ kind: "create" })} className="flex min-h-10 items-center gap-2 rounded-full efek-tekan bg-brand-primary px-4 text-sm font-semibold text-brand-on-primary hover:bg-brand-primary-strong">
            <Plus size={18} strokeWidth={1.8} />
            Tambah peran
          </button>
        </div>

        {notice && <div className="mt-4"><Alert tone="success">{notice}</Alert></div>}
        {error && <div className="mt-4"><Alert>{error}</Alert></div>}

        <section className="mt-6 overflow-hidden rounded-card border border-neutral-line bg-neutral-surface shadow-card">
          <div className="overflow-x-auto">
            <table className={`w-full min-w-[760px] border-collapse text-left ${loading ? "opacity-60" : ""}`}>
              <thead className="bg-neutral-bg">
                <tr className="border-b border-neutral-line bg-neutral-soft text-xs font-semibold uppercase tracking-[0.04em] text-text-muted">
                  <th className="px-4 py-3">Peran</th>
                  <th className="px-4 py-3">Izin</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {roles.map((role) => (
                  <tr key={role.id} className="border-b border-neutral-line align-top last:border-0">
                    <td className="px-4 py-3">
                      <p className="flex items-center gap-1.5 text-sm font-semibold text-text-default">
                        {role.name}
                        {role.is_system && <Lock size={13} className="text-text-muted" aria-label="Peran bawaan" />}
                      </p>
                      <p className="font-mono text-xs text-text-muted">{role.code}</p>
                      {role.description && <p className="mt-1 text-xs text-text-muted">{role.description}</p>}
                    </td>
                    <td className="max-w-[360px] px-4 py-3">
                      {role.is_system ? (
                        <span className="text-xs text-text-muted">Semua izin organisasi (otomatis)</span>
                      ) : role.permissions.length === 0 ? (
                        <span className="text-xs text-text-muted">Belum ada izin</span>
                      ) : (
                        <div className="flex flex-wrap gap-1">
                          {role.permissions.map((p) => (
                            <span key={p} className="rounded bg-brand-primary-soft px-1.5 py-0.5 font-mono text-[11px] text-brand-primary">{p}</span>
                          ))}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${role.is_active ? "bg-success-soft text-success" : "bg-neutral-soft text-text-muted"}`}>
                        {role.is_active ? "Aktif" : "Nonaktif"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {role.is_system ? (
                        <span className="text-xs text-text-muted">Bawaan</span>
                      ) : (
                        <div className="flex justify-end gap-3">
                          <button type="button" onClick={() => setDialog({ kind: "edit", role })} className="text-sm font-semibold text-brand-primary hover:underline">Ubah</button>
                          {role.is_active ? (
                            <button type="button" onClick={() => setDialog({ kind: "deactivate", role })} className="text-sm font-semibold text-danger hover:underline">Nonaktifkan</button>
                          ) : (
                            <button type="button" onClick={() => setDialog({ kind: "activate", role })} className="text-sm font-semibold text-brand-primary hover:underline">Aktifkan</button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
                {!loading && roles.length === 0 && (
                  <tr><td colSpan={4} className="px-4 py-10 text-center text-sm text-text-muted">Belum ada peran.</td></tr>
                )}
              </tbody>
            </table>
          </div>
          <Pagination meta={data?.meta ?? null} itemCount={roles.length} noun="peran" onPageChange={setPage} />
        </section>
      </div>

      {(dialog?.kind === "create" || dialog?.kind === "edit") && (
        <RoleFormModal role={dialog.kind === "edit" ? dialog.role : null} permissions={permissions} onClose={() => setDialog(null)} onSaved={onSaved} />
      )}
      {dialog?.kind === "deactivate" && (
        <ConfirmDialog
          title="Nonaktifkan peran"
          confirmLabel="Nonaktifkan"
          onConfirm={() => deactivateRole(dialog.role.id)}
          onClose={() => setDialog(null)}
          onDone={() => onSaved(`Peran ${dialog.role.name} dinonaktifkan.`)}
        >
          Peran <strong className="text-text-default">{dialog.role.name}</strong> tidak bisa dipilih lagi untuk pengguna.
          Peran yang masih dipakai pengguna aktif tidak dapat dinonaktifkan.
        </ConfirmDialog>
      )}
      {dialog?.kind === "activate" && (
        <ConfirmDialog
          title="Aktifkan peran"
          confirmLabel="Aktifkan"
          tone="primary"
          onConfirm={() => activateRole(dialog.role.id)}
          onClose={() => setDialog(null)}
          onDone={() => onSaved(`Peran ${dialog.role.name} diaktifkan kembali.`)}
        >
          Peran <strong className="text-text-default">{dialog.role.name}</strong> bisa dipilih lagi untuk pengguna, dengan
          izin terakhirnya.
        </ConfirmDialog>
      )}
    </AdminLayout>
  );
};

export default RolesPage;
