import { Plus } from "lucide-react";
import Alert from "../../../../components/common/Alert/Alert";
import Pagination from "../../../../components/common/Pagination/Pagination";
import DivisionFormModal from "../DivisionFormModal";
import { useDivisions } from "../../hooks/useDivisions";
import { formatDate } from "../../../../utils/formatDate";
import { rowNumber } from "../../../../utils/pagination";

const Divisions = () => {
  const { setPage, data, divisions, error, loading, dialog, setDialog, closeDialog, onSaved } = useDivisions();

  return (
    <>
      <div>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl leading-tight font-medium text-text-strong">Divisi</h1>
            <p className="mt-1 text-sm leading-[22px] text-text-muted">Divisi global yang bisa dipilih untuk akun di semua partner.</p>
          </div>
          <button type="button" onClick={() => setDialog({ kind: "create" })} className="flex min-h-10 items-center gap-2 rounded-full efek-tekan bg-brand-primary px-4 text-sm font-semibold text-brand-on-primary hover:bg-brand-primary-strong">
            <Plus size={18} strokeWidth={1.8} />
            Tambah divisi
          </button>
        </div>
        {error && <div className="mt-4"><Alert>{error}</Alert></div>}

        <section className="mt-6 overflow-hidden rounded-card border border-neutral-line bg-neutral-surface shadow-card">
          <div className="overflow-x-auto">
            <table className={`w-full min-w-[600px] border-collapse text-left ${loading ? "opacity-60" : ""}`}>
              <thead className="bg-neutral-bg">
                <tr className="border-b border-neutral-line bg-neutral-soft text-xs font-semibold uppercase tracking-[0.04em] text-text-muted">
                  <th className="w-14 px-4 py-3 text-center">No</th>
                  <th className="px-4 py-3">Divisi</th>
                  <th className="px-4 py-3">Dibuat</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {divisions.map((d, index) => (
                  <tr key={d.id} className="border-b border-neutral-line last:border-0">
                    <td className="px-4 py-3 text-center text-sm text-text-muted tabular-nums">{rowNumber(data?.meta, index)}</td>
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
                  </tr>
                ))}
                {!loading && divisions.length === 0 && (
                  <tr><td colSpan={4} className="px-4 py-10 text-center text-sm text-text-muted">Belum ada divisi. Tambahkan divisi pertama.</td></tr>
                )}
              </tbody>
            </table>
          </div>
          <Pagination meta={data?.meta ?? null} itemCount={divisions.length} noun="divisi" onPageChange={setPage} />
        </section>
      </div>

      {dialog?.kind === "create" && <DivisionFormModal onClose={closeDialog} onSaved={onSaved} />}
    </>
  );
};

export default Divisions;
