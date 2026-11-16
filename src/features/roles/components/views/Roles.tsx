import { Plus, ShieldCheck } from "lucide-react";
import Alert from "../../../../components/common/Alert/Alert";
import Pagination from "../../../../components/common/Pagination/Pagination";
import RoleFormModal from "../RoleFormModal";
import RowAction from "../../../../components/common/RowAction/RowAction";
import { useRoles } from "../../hooks/useRoles";
import { formatDate } from "../../../../utils/formatDate";
import { rowNumber } from "../../../../utils/pagination";

const Roles = () => {
  const { setPage, data, roles, error, loading, permissions, dialog, setDialog, closeDialog, onSaved } = useRoles();

  return (
    <>
      <div>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl leading-tight font-medium text-text-strong">Peran &amp; Izin</h1>
            <p className="mt-1 text-sm leading-[22px] text-text-muted">Kelola peran global platform dan pilih izin untuk tiap peran.</p>
          </div>
          <button type="button" onClick={() => setDialog({ kind: "create" })} className="flex min-h-10 items-center gap-2 rounded-full efek-tekan bg-brand-primary px-4 text-sm font-semibold text-brand-on-primary hover:bg-brand-primary-strong">
            <Plus size={18} strokeWidth={1.8} />
            Tambah peran
          </button>
        </div>
        {error && <div className="mt-4"><Alert>{error}</Alert></div>}

        <section className="mt-6 overflow-hidden rounded-card border border-neutral-line bg-neutral-surface shadow-card">
          <div className="overflow-x-auto">
            <table className={`w-full min-w-[680px] border-collapse text-left ${loading ? "opacity-60" : ""}`}>
              <thead className="bg-neutral-bg">
                <tr className="border-b border-neutral-line bg-neutral-soft text-xs font-semibold uppercase tracking-[0.04em] text-text-muted">
                  <th className="w-14 px-4 py-3 text-center">No</th>
                  <th className="px-4 py-3">Peran</th>
                  <th className="px-4 py-3">Dibuat</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {roles.map((role, index) => (
                  <tr key={role.id} className="border-b border-neutral-line align-top last:border-0">
                    <td className="px-4 py-3 text-center text-sm text-text-muted tabular-nums">{rowNumber(data?.meta, index)}</td>
                    <td className="px-4 py-3">
                      <p className="text-sm font-semibold text-text-default">{role.name}</p>
                      <p className="font-mono text-xs text-text-muted">{role.code}</p>
                      {role.description && <p className="mt-1 text-xs text-text-muted">{role.description}</p>}
                    </td>
                    <td className="px-4 py-3 text-sm text-text-muted">{formatDate(role.created_at)}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${role.is_active ? "bg-success-soft text-success" : "bg-neutral-soft text-text-muted"}`}>
                        {role.is_active ? "Aktif" : "Nonaktif"}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      {/* Satu-satunya aksi: ikon + teks agar maknanya langsung jelas. */}
                      <RowAction icon={ShieldCheck} label="Atur izin" showLabel onClick={() => setDialog({ kind: "edit", role })} />
                    </td>
                  </tr>
                ))}
                {!loading && roles.length === 0 && (
                  <tr><td colSpan={5} className="px-4 py-10 text-center text-sm text-text-muted">Belum ada peran.</td></tr>
                )}
              </tbody>
            </table>
          </div>
          <Pagination meta={data?.meta ?? null} itemCount={roles.length} noun="peran" onPageChange={setPage} />
        </section>
      </div>

      {dialog && (
        <RoleFormModal role={dialog.kind === "edit" ? dialog.role : null} permissions={permissions} onClose={closeDialog} onSaved={onSaved} />
      )}
    </>
  );
};

export default Roles;
