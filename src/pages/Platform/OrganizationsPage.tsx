import { useEffect, useState } from "react";
import { Building2, Plus, Search } from "lucide-react";
import AdminLayout from "../Admin/AdminLayout";
import Alert from "../../components/common/Alert/Alert";
import Pagination from "../../components/common/Pagination/Pagination";
import ConfirmDialog from "../../components/common/ConfirmDialog/ConfirmDialog";
import OrganizationFormModal from "../../features/organizations/components/OrganizationFormModal";
import { activateOrganization, deactivateOrganization, deleteOrganization, listOrganizations, type Organization } from "../../features/organizations";
import { useAsync } from "../../hooks/useAsync";
import { useDebounce } from "../../hooks/useDebounce";
import { formatDate } from "../../utils/formatDate";

type Dialog =
  | { kind: "create" }
  | { kind: "edit"; org: Organization }
  | { kind: "deactivate"; org: Organization }
  | { kind: "activate"; org: Organization }
  | { kind: "delete"; org: Organization }
  | null;

const STATUS: Record<string, boolean | undefined> = { semua: undefined, aktif: true, nonaktif: false };

// Halaman super admin: mendaftarkan organisasi yang memakai platform.
const OrganizationsPage = () => {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("semua");
  const [page, setPage] = useState(1);
  const [reloadKey, setReloadKey] = useState(0);
  const [dialog, setDialog] = useState<Dialog>(null);
  const [notice, setNotice] = useState("");
  const q = useDebounce(query.trim());

  useEffect(() => {
    document.title = "Organisasi";
  }, []);

  const { data, error, loading } = useAsync(listOrganizations, { page, q, is_active: STATUS[status] }, reloadKey);
  const orgs = data?.data ?? [];

  function onSaved(message: string) {
    setDialog(null);
    setNotice(message);
    setReloadKey((k) => k + 1);
  }

  return (
    <AdminLayout>
      <div className="p-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="font-body text-[32px] font-semibold leading-10 text-text-default">Organisasi</h1>
            <p className="mt-1 text-sm leading-[22px] text-text-muted">Organisasi yang memakai platform. Tiap organisasi mengatur pengguna, peran, dan divisinya sendiri.</p>
          </div>
          <button type="button" onClick={() => setDialog({ kind: "create" })} className="flex h-10 items-center gap-2 rounded-field bg-brand-primary px-4 text-sm font-semibold text-brand-on-primary hover:bg-brand-primary-strong">
            <Plus size={18} strokeWidth={1.8} />
            Daftarkan organisasi
          </button>
        </div>

        {notice && <div className="mt-4"><Alert tone="success">{notice}</Alert></div>}
        {error && <div className="mt-4"><Alert>{error}</Alert></div>}

        <section className="mt-6 overflow-hidden rounded-card border border-neutral-line bg-neutral-surface shadow-card">
          <div className="flex flex-wrap items-center gap-3 border-b border-neutral-line p-4">
            <div className="relative min-w-[240px] flex-1">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" aria-hidden />
              <input type="search" value={query} onChange={(e) => { setQuery(e.target.value); setPage(1); }} placeholder="Cari nama atau kode" aria-label="Cari organisasi" className="h-10 w-full rounded-field border border-neutral-line-strong bg-neutral-surface pl-10 pr-3 text-sm outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20" />
            </div>
            <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} aria-label="Filter status" className="h-10 rounded-field border border-neutral-line-strong bg-neutral-surface px-3 text-sm outline-none focus:border-brand-primary">
              <option value="semua">Semua status</option>
              <option value="aktif">Aktif</option>
              <option value="nonaktif">Nonaktif</option>
            </select>
          </div>
          <div className="overflow-x-auto">
            <table className={`w-full min-w-[640px] border-collapse text-left ${loading ? "opacity-60" : ""}`}>
              <thead className="bg-neutral-bg">
                <tr className="border-b border-neutral-line text-xs font-semibold uppercase tracking-wide text-neutral-line-strong">
                  <th className="px-4 py-3">Organisasi</th>
                  <th className="px-4 py-3">Terdaftar</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {orgs.map((org) => (
                  <tr key={org.id} className="border-b border-neutral-line last:border-0">
                    <td className="px-4 py-3">
                      <p className="text-sm font-semibold text-text-default">{org.name}</p>
                      <p className="font-mono text-xs text-text-muted">{org.code} · ID {org.id}</p>
                    </td>
                    <td className="px-4 py-3 text-sm text-text-muted">{formatDate(org.created_at)}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${org.is_active ? "bg-success-soft text-success" : "bg-neutral-soft text-text-muted"}`}>
                        {org.is_active ? "Aktif" : "Nonaktif"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-3">
                        <button type="button" onClick={() => setDialog({ kind: "edit", org })} className="text-sm font-semibold text-brand-primary hover:underline">Ubah</button>
                        {org.is_active && (
                          <button type="button" onClick={() => setDialog({ kind: "deactivate", org })} className="text-sm font-semibold text-danger hover:underline">Nonaktifkan</button>
                        )}
                        {!org.is_active && (
                          <button type="button" onClick={() => setDialog({ kind: "activate", org })} className="text-sm font-semibold text-brand-primary hover:underline">Aktifkan</button>
                        )}
                        {!org.is_active && (
                          <button type="button" onClick={() => setDialog({ kind: "delete", org })} className="text-sm font-semibold text-danger hover:underline">Hapus permanen</button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {!loading && orgs.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-12 text-center">
                      <Building2 size={28} className="mx-auto text-neutral-line-strong" aria-hidden />
                      <p className="mt-2 text-sm text-text-muted">{q || status !== "semua" ? "Tidak ada organisasi yang cocok." : "Belum ada organisasi terdaftar."}</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <Pagination meta={data?.meta ?? null} itemCount={orgs.length} noun="organisasi" onPageChange={setPage} />
        </section>
      </div>

      {(dialog?.kind === "create" || dialog?.kind === "edit") && (
        <OrganizationFormModal organization={dialog.kind === "edit" ? dialog.org : null} onClose={() => setDialog(null)} onSaved={onSaved} />
      )}
      {dialog?.kind === "deactivate" && (
        <ConfirmDialog
          title="Nonaktifkan organisasi"
          confirmLabel="Nonaktifkan"
          onConfirm={() => deactivateOrganization(dialog.org.id)}
          onClose={() => setDialog(null)}
          onDone={() => onSaved(`Organisasi ${dialog.org.name} dinonaktifkan.`)}
        >
          Semua pengguna <strong className="text-text-default">{dialog.org.name}</strong> tidak akan bisa login lagi.
          Data organisasi tetap tersimpan.
        </ConfirmDialog>
      )}
      {dialog?.kind === "activate" && (
        <ConfirmDialog
          title="Aktifkan organisasi"
          confirmLabel="Aktifkan"
          tone="primary"
          onConfirm={() => activateOrganization(dialog.org.id)}
          onClose={() => setDialog(null)}
          onDone={() => onSaved(`Organisasi ${dialog.org.name} diaktifkan kembali.`)}
        >
          Pengguna aktif di <strong className="text-text-default">{dialog.org.name}</strong> bisa login lagi dengan peran
          dan datanya yang terakhir.
        </ConfirmDialog>
      )}
      {dialog?.kind === "delete" && (
        <ConfirmDialog
          title="Hapus organisasi permanen"
          confirmLabel="Hapus permanen"
          onConfirm={() => deleteOrganization(dialog.org.id)}
          onClose={() => setDialog(null)}
          onDone={() => onSaved(`Organisasi ${dialog.org.name} dihapus permanen.`)}
        >
          Organisasi <strong className="text-text-default">{dialog.org.name}</strong> beserta seluruh pengguna, peran,
          dan divisinya akan dihapus dan tidak dapat dikembalikan. Audit log organisasi ini tetap tersimpan dan dapat
          dilihat di menu Audit log platform.
        </ConfirmDialog>
      )}
    </AdminLayout>
  );
};

export default OrganizationsPage;
