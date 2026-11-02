import { Search, SlidersHorizontal, UserPlus } from "lucide-react";
import { useMemo, useState } from "react";
import AdminLayout from "./AdminLayout";

interface User {
  name: string;
  email: string;
  role: string;
  status: "Aktif" | "Nonaktif";
}

const users: User[] = [
  { name: "Ahmad Fauzan", email: "ahmad.fauzan@email.com", role: "Admin", status: "Aktif" },
  { name: "Siti Rahma", email: "siti.rahma@email.com", role: "Pengguna", status: "Aktif" },
  { name: "Budi Santoso", email: "budi.santoso@email.com", role: "Pengguna", status: "Nonaktif" },
  { name: "Citra Lestari", email: "citra.lestari@email.com", role: "Pengguna", status: "Aktif" },
  { name: "Dimas Pratama", email: "dimas.pratama@email.com", role: "Pengguna", status: "Aktif" },
];

const UsersPage = () => {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("Semua status");

  const filteredUsers = useMemo(
    () =>
      users.filter((user) => {
        const matchesQuery = `${user.name} ${user.email}`.toLowerCase().includes(query.toLowerCase());
        const matchesStatus = status === "Semua status" || user.status === status;
        return matchesQuery && matchesStatus;
      }),
    [query, status],
  );

  return (
    <AdminLayout>
      <div className="p-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="font-body text-[32px] font-semibold leading-10 text-text-default">Pengguna</h1>
            <p className="mt-1 text-sm leading-[22px] text-text-muted">Kelola data pengguna dan akses mereka.</p>
          </div>
          <button type="button" className="flex h-10 items-center gap-2 rounded-field bg-brand-primary px-4 text-sm font-semibold text-white hover:bg-[#172f5e]">
            <UserPlus size={18} strokeWidth={1.8} />
            Tambah pengguna
          </button>
        </div>

        <section className="mt-6 overflow-hidden rounded-card border border-neutral-line bg-neutral-surface shadow-card">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-line p-4">
            <div className="relative min-w-[240px] flex-1">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" aria-hidden />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Cari nama atau email"
                aria-label="Cari pengguna"
                className="h-10 w-full rounded-field border border-neutral-line-strong bg-white pl-10 pr-3 text-sm text-text-default outline-none placeholder:text-text-muted focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
              />
            </div>
            <div className="flex items-center gap-2">
              <SlidersHorizontal size={18} className="text-text-muted" aria-hidden />
              <select value={status} onChange={(event) => setStatus(event.target.value)} aria-label="Filter status" className="h-10 rounded-field border border-neutral-line-strong bg-white px-3 text-sm text-text-default outline-none focus:border-brand-primary">
                <option>Semua status</option>
                <option>Aktif</option>
                <option>Nonaktif</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] border-collapse text-left">
              <thead className="bg-neutral-bg">
                <tr className="border-b border-neutral-line text-xs font-semibold uppercase tracking-wide text-neutral-line-strong">
                  <th className="px-4 py-3">Nama pengguna</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.email} className="border-b border-neutral-line last:border-0 hover:bg-neutral-bg/60">
                    <td className="px-4 py-3">
                      <p className="text-sm font-semibold text-text-default">{user.name}</p>
                      <p className="text-xs leading-5 text-text-muted">{user.email}</p>
                    </td>
                    <td className="px-4 py-3 text-sm text-text-muted">{user.role}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${user.status === "Aktif" ? "bg-[#dcfce7] text-[#166534]" : "bg-[#f1f5f9] text-text-muted"}`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button type="button" className="text-sm font-semibold text-brand-primary hover:underline">Detail</button>
                    </td>
                  </tr>
                ))}
                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-10 text-center text-sm text-text-muted">Pengguna tidak ditemukan.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between border-t border-neutral-line px-4 py-3 text-sm text-text-muted">
            <span>Menampilkan {filteredUsers.length} dari {users.length} pengguna</span>
            <div className="flex gap-1">
              <button type="button" disabled className="rounded border border-neutral-line px-3 py-1.5 text-xs disabled:cursor-not-allowed disabled:opacity-50">Sebelumnya</button>
              <button type="button" className="rounded border border-brand-primary bg-brand-primary px-3 py-1.5 text-xs text-white">1</button>
              <button type="button" disabled className="rounded border border-neutral-line px-3 py-1.5 text-xs disabled:cursor-not-allowed disabled:opacity-50">Berikutnya</button>
            </div>
          </div>
        </section>
      </div>
    </AdminLayout>
  );
};

export default UsersPage;
