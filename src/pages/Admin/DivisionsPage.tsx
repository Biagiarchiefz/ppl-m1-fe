import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import AdminLayout from "./AdminLayout";
import Alert from "../../components/common/Alert/Alert";
import Pagination from "../../components/common/Pagination/Pagination";
import ConfirmDialog from "../../components/common/ConfirmDialog/ConfirmDialog";
import DivisionFormModal from "../../features/divisions/components/DivisionFormModal";
import { activateDivision, deactivateDivision, listDivisions, type Division } from "../../features/divisions";
import { useAsync } from "../../hooks/useAsync";
import { formatDate } from "../../utils/formatDate";

type Dialog = { kind: "create" } | { kind: "edit"; division: Division } | { kind: "deactivate" | "activate"; division: Division } | null;

// Divisi milik organisasi, disesuaikan dengan struktur organisasinya sendiri.
const DivisionsPage = () => {
  const [page, setPage] = useState(1);
  const [reloadKey, setReloadKey] = useState(0);
  const [dialog, setDialog] = useState<Dialog>(null);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    document.title = "Divisi";
  }, []);

  const { data, error, loading } = useAsync(listDivisions, { page }, reloadKey);
  const divisions = data?.data ?? [];

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
            <h1 className="text-2xl leading-tight font-medium text-text-strong">Divisi</h1>
            <p className="mt-1 text-sm leading-[22px] text-text-muted">Susun divisi sesuai struktur organisasi Anda.</p>
          </div>
          <button type="button" onClick={() => setDialog({ kind: "create" })} className="flex min-h-10 items-center gap-2 rounded-full efek-tekan bg-brand-primary px-4 text-sm font-semibold text-brand-on-primary hover:bg-brand-primary-strong">
            <Plus size={18} strokeWidth={1.8} />
            Tambah divisi
          </button>
        </div>

        {notice && <div className="mt-4"><Alert tone="success">{notice}</Alert></div>}
        {error && <div className="mt-4"><Alert>{error}</Alert></div>}

        <section className="mt-6 overflow-hidden rounded-card border border-neutral-line bg-neutral-surface shadow-card">
          <div className="overflow-x-auto">
            <table className={`w-full min-w-[600px] border-collapse text-left ${loading ? "opacity-60" : ""}`}>
              <thead className="bg-neutral-bg">
                <tr className="border-b border-neutral-line bg-neutral-soft text-xs font-semibold uppercase tracking-[0.04em] text-text-muted">
                  <th className="px-4 py-3">Divisi</th>
                  <th className="px-4 py-3">Dibuat</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {divisions.map((d) => (
                  <tr key={d.id} className="border-b border-neutral-line last:border-0">
                    <td className="px-4 py-3">
                      <p className="text-sm font-semibold text-text-default">{d.name}</p>
                      <p className="font-mono text-xs text-text-muted">{d.code}</p>
                    </td>
                    <td className="px-4 py-3 text-sm text-text-muted">{formatDate(d.created_at)}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${d.is_active ? "bg-success-soft text-success" : "bg-neutral-soft text-text-muted"}`}>
                        {d.is_active ? "Aktif" : "Nonaktif"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-3">
                        <button type="button" onClick={() => setDialog({ kind: "edit", division: d })} className="text-sm font-semibold text-brand-primary hover:underline">Ubah</button>
                        {d.is_active ? (
                          <button type="button" onClick={() => setDialog({ kind: "deactivate", division: d })} className="text-sm font-semibold text-danger hover:underline">Nonaktifkan</button>
                        ) : (
                          <button type="button" onClick={() => setDialog({ kind: "activate", division: d })} className="text-sm font-semibold text-brand-primary hover:underline">Aktifkan</button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {!loading && divisions.length === 0 && (
                  <tr><td colSpan={4} className="px-4 py-10 text-center text-sm text-text-muted">Belum ada divisi. Tambahkan divisi pertama organisasi Anda.</td></tr>
                )}
              </tbody>
            </table>
          </div>
          <Pagination meta={data?.meta ?? null} itemCount={divisions.length} noun="divisi" onPageChange={setPage} />
        </section>
      </div>

      {(dialog?.kind === "create" || dialog?.kind === "edit") && (
        <DivisionFormModal division={dialog.kind === "edit" ? dialog.division : null} onClose={() => setDialog(null)} onSaved={onSaved} />
      )}
      {dialog?.kind === "deactivate" && (
        <ConfirmDialog
          title="Nonaktifkan divisi"
          confirmLabel="Nonaktifkan"
          onConfirm={() => deactivateDivision(dialog.division.id)}
          onClose={() => setDialog(null)}
          onDone={() => onSaved(`Divisi ${dialog.division.name} dinonaktifkan.`)}
        >
          Divisi <strong className="text-text-default">{dialog.division.name}</strong> tidak bisa dipilih lagi untuk pengguna.
          Divisi yang masih dipakai pengguna aktif tidak dapat dinonaktifkan.
        </ConfirmDialog>
      )}
      {dialog?.kind === "activate" && (
        <ConfirmDialog
          title="Aktifkan divisi"
          confirmLabel="Aktifkan"
          tone="primary"
          onConfirm={() => activateDivision(dialog.division.id)}
          onClose={() => setDialog(null)}
          onDone={() => onSaved(`Divisi ${dialog.division.name} diaktifkan kembali.`)}
        >
          Divisi <strong className="text-text-default">{dialog.division.name}</strong> bisa dipilih lagi untuk pengguna.
        </ConfirmDialog>
      )}
    </AdminLayout>
  );
};

export default DivisionsPage;
