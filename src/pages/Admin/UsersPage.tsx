import { Search, SlidersHorizontal, UserPlus } from "lucide-react";
import { useEffect, useState } from "react";
import AdminLayout from "./AdminLayout";
import Alert from "../../components/common/Alert/Alert";
import Pagination from "../../components/common/Pagination/Pagination";
import Select from "../../components/common/Select/Select";
import UserFormModal from "../../features/users/components/UserFormModal";
import DeactivateDialog from "../../features/users/components/DeactivateDialog";
import ConfirmDialog from "../../components/common/ConfirmDialog/ConfirmDialog";
import { activateUser, deleteUser, listUsers, type User } from "../../features/users";
import { referenceName, useReferences } from "../../features/users/useReferences";
import { can, getSessionUser } from "../../features/auth/auth.Slice";
import { PERM } from "../../config/env";
import { useAsync } from "../../hooks/useAsync";
import { useDebounce } from "../../hooks/useDebounce";

const STATUS_FILTER: Record<string, boolean | undefined> = {
  semua: undefined,
  aktif: true,
  nonaktif: false,
};

const STATUS_OPTIONS = [
  { value: "semua", label: "Semua status" },
  { value: "aktif", label: "Aktif" },
  { value: "nonaktif", label: "Nonaktif" },
];

type Dialog =
  | { kind: "create" }
  | { kind: "edit"; user: User }
  | { kind: "deactivate"; user: User }
  | { kind: "activate"; user: User }
  | { kind: "delete"; user: User }
  | null;

const UsersPage = () => {
  const { roles, divisions } = useReferences();
  const sessionUser = getSessionUser();
  const currentUserId = sessionUser?.user_id;
  const canManage = can(sessionUser, PERM.usersManage);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("semua");
  const [role, setRole] = useState("");
  const [page, setPage] = useState(1);
  const [reloadKey, setReloadKey] = useState(0);
  const [dialog, setDialog] = useState<Dialog>(null);
  const [notice, setNotice] = useState("");
  const q = useDebounce(query.trim());

  useEffect(() => {
    document.title = "Pengguna";
  }, []);

  const { data, error, loading } = useAsync(
    listUsers,
    { page, q, role, is_active: STATUS_FILTER[status] },
    reloadKey,
  );
  const users = data?.data ?? [];

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
            <h1 className="text-2xl leading-tight font-medium text-text-strong">Pengguna</h1>
            <p className="mt-1 text-sm leading-[22px] text-text-muted">Kelola data pengguna dan akses mereka.</p>
          </div>
          {canManage && (
            <button type="button" onClick={() => setDialog({ kind: "create" })} className="flex min-h-10 items-center gap-2 rounded-full efek-tekan bg-brand-primary px-4 text-sm font-semibold text-brand-on-primary hover:bg-brand-primary-strong">
              <UserPlus size={18} strokeWidth={1.8} />
              Tambah pengguna
            </button>
          )}
        </div>

        {notice && <div className="mt-4"><Alert tone="success">{notice}</Alert></div>}
        {error && <div className="mt-4"><Alert>{error}</Alert></div>}

        <section className="mt-6 overflow-hidden rounded-card border border-neutral-line bg-neutral-surface shadow-card">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-line p-4">
            <div className="relative min-w-[240px] flex-1">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" aria-hidden />
              <input
                type="search"
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setPage(1);
                }}
                placeholder="Cari nama atau email"
                aria-label="Cari pengguna"
                className="h-10 w-full rounded-field border border-neutral-line bg-neutral-surface hover:border-neutral-line-strong pl-10 pr-3 text-sm text-text-default outline-none placeholder:text-text-muted focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/30"
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <SlidersHorizontal size={18} className="text-text-muted lg:hidden" aria-hidden />
              <Select
                label="Filter peran"
                hideLabel
                className="w-44"
                value={role}
                placeholder="Semua peran"
                options={roles.map((r) => ({ value: r.code, label: r.name }))}
                onChange={(v) => { setRole(v); setPage(1); }}
              />
              <Select
                label="Filter status"
                hideLabel
                className="w-40"
                value={status}
                options={STATUS_OPTIONS}
                onChange={(v) => { setStatus(v); setPage(1); }}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className={`w-full min-w-[760px] border-collapse text-left ${loading ? "opacity-60" : ""}`}>
              <thead className="bg-neutral-bg">
                <tr className="border-b border-neutral-line bg-neutral-soft text-xs font-semibold uppercase tracking-[0.04em] text-text-muted">
                  <th className="px-4 py-3">Nama pengguna</th>
                  <th className="px-4 py-3">Peran</th>
                  <th className="px-4 py-3">Divisi</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-neutral-line last:border-0 hover:bg-neutral-bg/60">
                    <td className="px-4 py-3">
                      <p className="text-sm font-semibold text-text-default">{user.name}</p>
                      <p className="text-xs leading-5 text-text-muted">{user.email}</p>
                    </td>
                    <td className="px-4 py-3 text-sm text-text-muted">{referenceName(roles, user.role)}</td>
                    <td className="px-4 py-3 text-sm text-text-muted">{referenceName(divisions, user.division)}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${user.is_active ? "bg-success-soft text-success" : "bg-neutral-soft text-text-muted"}`}>
                        {user.is_active ? "Aktif" : "Nonaktif"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-3">
                        {!canManage && <span className="text-xs text-text-muted">Hanya lihat</span>}
                        {canManage && (
                          <button type="button" onClick={() => setDialog({ kind: "edit", user })} className="text-sm font-semibold text-brand-primary hover:underline">
                            Ubah
                          </button>
                        )}
                        {canManage && user.is_active && user.id !== currentUserId && (
                          <button type="button" onClick={() => setDialog({ kind: "deactivate", user })} className="text-sm font-semibold text-danger hover:underline">
                            Nonaktifkan
                          </button>
                        )}
                        {canManage && !user.is_active && (
                          <button type="button" onClick={() => setDialog({ kind: "activate", user })} className="text-sm font-semibold text-brand-primary hover:underline">
                            Aktifkan
                          </button>
                        )}
                        {canManage && !user.is_active && (
                          <button type="button" onClick={() => setDialog({ kind: "delete", user })} className="text-sm font-semibold text-danger hover:underline">
                            Hapus permanen
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {!loading && users.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-10 text-center text-sm text-text-muted">
                      {q || role || status !== "semua" ? "Tidak ada pengguna yang cocok dengan filter." : "Belum ada pengguna."}
                    </td>
                  </tr>
                )}
                {loading && users.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-10 text-center text-sm text-text-muted">Memuat data...</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <Pagination meta={data?.meta ?? null} itemCount={users.length} noun="pengguna" onPageChange={setPage} />
        </section>
      </div>

      {(dialog?.kind === "create" || dialog?.kind === "edit") && (
        <UserFormModal
          user={dialog.kind === "edit" ? dialog.user : null}
          roles={roles}
          divisions={divisions}
          onClose={() => setDialog(null)}
          onSaved={onSaved}
        />
      )}
      {dialog?.kind === "deactivate" && (
        <DeactivateDialog user={dialog.user} onClose={() => setDialog(null)} onDone={onSaved} />
      )}
      {dialog?.kind === "activate" && (
        <ConfirmDialog
          title="Aktifkan akun"
          confirmLabel="Aktifkan"
          tone="primary"
          onConfirm={() => activateUser(dialog.user.id)}
          onClose={() => setDialog(null)}
          onDone={() => onSaved(`Akun ${dialog.user.name} diaktifkan kembali.`)}
        >
          Akun <strong className="text-text-default">{dialog.user.name}</strong> ({dialog.user.email}) dapat login lagi
          dengan peran dan kata sandi terakhirnya.
        </ConfirmDialog>
      )}
      {dialog?.kind === "delete" && (
        <ConfirmDialog
          title="Hapus akun permanen"
          confirmLabel="Hapus permanen"
          onConfirm={() => deleteUser(dialog.user.id)}
          onClose={() => setDialog(null)}
          onDone={() => onSaved(`Akun ${dialog.user.name} dihapus permanen.`)}
        >
          Akun <strong className="text-text-default">{dialog.user.name}</strong> ({dialog.user.email}) akan dihapus dan
          tidak dapat dikembalikan. Riwayat audit log tetap tersimpan, termasuk nama dan email akun ini sebagai pelaku.
        </ConfirmDialog>
      )}
    </AdminLayout>
  );
};

export default UsersPage;
