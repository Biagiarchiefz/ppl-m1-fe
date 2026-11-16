import { Search, SlidersHorizontal, UserCheck, UserPen, UserPlus, UserX } from "lucide-react";
import Alert from "../../../../components/common/Alert/Alert";
import Pagination from "../../../../components/common/Pagination/Pagination";
import Select from "../../../../components/common/Select/Select";
import ConfirmDialog from "../../../../components/common/ConfirmDialog/ConfirmDialog";
import RowAction from "../../../../components/common/RowAction/RowAction";
import UserFormModal from "../UserFormModal";
import DeactivateDialog from "../DeactivateDialog";
import { referenceName } from "../../hooks/useReferences";
import { STATUS_OPTIONS, useUsers } from "../../hooks/useUsers";
import { rowNumber } from "../../../../utils/pagination";

const Users = () => {
  const {
    roles,
    divisions,
    currentUserId,
    query,
    changeQuery,
    role,
    changeRole,
    partner,
    changePartner,
    status,
    changeStatus,
    setPage,
    data,
    users,
    error,
    loading,
    hasFilter,
    dialog,
    setDialog,
    closeDialog,
    onSaved,
    activateUser,
  } = useUsers();

  return (
    <>
      <div>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl leading-tight font-medium text-text-strong">Pengguna</h1>
            <p className="mt-1 text-sm leading-[22px] text-text-muted">Kelola akun pengguna di seluruh partner.</p>
          </div>
          <button type="button" onClick={() => setDialog({ kind: "create" })} className="flex min-h-10 items-center gap-2 rounded-full efek-tekan bg-brand-primary px-4 text-sm font-semibold text-brand-on-primary hover:bg-brand-primary-strong">
            <UserPlus size={18} strokeWidth={1.8} />
            Tambah pengguna
          </button>
        </div>
        {error && <div className="mt-4"><Alert>{error}</Alert></div>}

        <section className="mt-6 overflow-hidden rounded-card border border-neutral-line bg-neutral-surface shadow-card">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-line p-4">
            <div className="relative min-w-[240px] flex-1">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" aria-hidden />
              <input
                type="search"
                value={query}
                onChange={(event) => changeQuery(event.target.value)}
                placeholder="Cari nama atau email"
                aria-label="Cari pengguna"
                className="h-10 w-full rounded-field border border-neutral-line bg-neutral-surface hover:border-neutral-line-strong pl-10 pr-3 text-sm text-text-default outline-none placeholder:text-text-muted focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/30"
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <SlidersHorizontal size={18} className="text-text-muted lg:hidden" aria-hidden />
              <input
                type="number"
                min={1}
                value={partner}
                onChange={(event) => changePartner(event.target.value)}
                placeholder="ID partner"
                aria-label="Filter ID partner"
                className="h-10 w-32 rounded-field border border-neutral-line bg-neutral-surface px-3 text-sm text-text-default outline-none placeholder:text-text-muted hover:border-neutral-line-strong focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/30"
              />
              <Select
                label="Filter peran"
                hideLabel
                className="w-44"
                value={role}
                placeholder="Semua peran"
                options={roles.map((r) => ({ value: r.code, label: r.name }))}
                onChange={changeRole}
              />
              <Select
                label="Filter status"
                hideLabel
                className="w-40"
                value={status}
                options={STATUS_OPTIONS}
                onChange={changeStatus}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className={`w-full min-w-[820px] border-collapse text-left ${loading ? "opacity-60" : ""}`}>
              <thead className="bg-neutral-bg">
                <tr className="border-b border-neutral-line bg-neutral-soft text-xs font-semibold uppercase tracking-[0.04em] text-text-muted">
                  <th className="w-14 px-4 py-3 text-center">No</th>
                  <th className="px-4 py-3">Nama pengguna</th>
                  <th className="px-4 py-3">Partner</th>
                  <th className="px-4 py-3">Peran</th>
                  <th className="px-4 py-3">Divisi</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="w-28 px-4 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={user.id} className="border-b border-neutral-line last:border-0 hover:bg-neutral-bg/60">
                    <td className="px-4 py-3 text-center text-sm text-text-muted tabular-nums">{rowNumber(data?.meta, index)}</td>
                    <td className="px-4 py-3">
                      <p className="text-sm font-semibold text-text-default">{user.name}</p>
                      <p className="text-xs leading-5 text-text-muted">{user.email}</p>
                    </td>
                    <td className="px-4 py-3 text-sm text-text-muted">{user.partner_id === null ? "-" : `#${user.partner_id}`}</td>
                    <td className="px-4 py-3 text-sm text-text-muted">{referenceName(roles, user.role)}</td>
                    <td className="px-4 py-3 text-sm text-text-muted">{referenceName(divisions, user.division)}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${user.is_active ? "bg-success-soft text-success" : "bg-neutral-soft text-text-muted"}`}>
                        {user.is_active ? "Aktif" : "Nonaktif"}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-right">
                      {/* Dua slot tetap (ubah + status), jadi ikon sejajar di semua baris. */}
                      <div className="flex justify-end gap-1">
                        <RowAction icon={UserPen} label={`Ubah ${user.name}`} hint="Ubah" onClick={() => setDialog({ kind: "edit", user })} />
                        {user.is_active ? (
                          <RowAction
                            icon={UserX}
                            tone="danger"
                            label={`Nonaktifkan ${user.name}`}
                            hint={user.id === currentUserId ? "Akun Anda sendiri" : "Nonaktifkan"}
                            disabled={user.id === currentUserId}
                            onClick={() => setDialog({ kind: "deactivate", user })}
                          />
                        ) : (
                          <RowAction icon={UserCheck} tone="success" label={`Aktifkan ${user.name}`} hint="Aktifkan" onClick={() => setDialog({ kind: "activate", user })} />
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {!loading && users.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-10 text-center text-sm text-text-muted">
                      {hasFilter ? "Tidak ada pengguna yang cocok dengan filter." : "Belum ada pengguna."}
                    </td>
                  </tr>
                )}
                {loading && users.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-10 text-center text-sm text-text-muted">Memuat data...</td>
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
          onClose={closeDialog}
          onSaved={onSaved}
        />
      )}
      {dialog?.kind === "deactivate" && (
        <DeactivateDialog user={dialog.user} onClose={closeDialog} onDone={onSaved} />
      )}
      {dialog?.kind === "activate" && (
        <ConfirmDialog
          title="Aktifkan akun"
          confirmLabel="Aktifkan"
          tone="primary"
          onConfirm={() => activateUser(dialog.user.id)}
          onClose={closeDialog}
          onDone={() => onSaved(`Akun ${dialog.user.name} diaktifkan kembali.`)}
        >
          Akun <strong className="text-text-default">{dialog.user.name}</strong> ({dialog.user.email}) dapat login lagi
          dengan peran dan kata sandi terakhirnya.
        </ConfirmDialog>
      )}
    </>
  );
};

export default Users;
