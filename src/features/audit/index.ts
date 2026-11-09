import { apiList } from "../../services/api";

// actor_name, actor_email, dan organization_name adalah salinan saat
// kejadian: tetap terisi walau pengguna/organisasinya sudah dihapus permanen
// (user_id/organization_id lalu menjadi null).
export interface AuditLog {
  id: number;
  organization_id: number | null;
  organization_name: string | null;
  user_id: number | null;
  actor_name: string | null;
  actor_email: string | null;
  action: string;
  resource: string;
  resource_id: number | null;
  old_value: Record<string, unknown> | null;
  new_value: Record<string, unknown> | null;
  ip_address: string | null;
  created_at: string;
}

export interface AuditFilter {
  page: number;
  per_page?: number;
  from?: string;
  to?: string;
  user_id?: string;
  organization_id?: string;
  action?: string;
  resource?: string;
  sort?: string;
}

export const AUDIT_ACTIONS: Record<string, string> = {
  "user.created": "Akun dibuat",
  "user.updated": "Akun diubah",
  "user.activated": "Akun diaktifkan kembali",
  "user.deactivated": "Akun dinonaktifkan",
  "user.deleted": "Akun dihapus permanen",
  "user.password_changed": "Kata sandi diganti",
  "auth.login_succeeded": "Login berhasil",
  "auth.login_failed": "Login gagal",
  "role.created": "Peran dibuat",
  "role.updated": "Peran diubah",
  "role.activated": "Peran diaktifkan kembali",
  "role.deactivated": "Peran dinonaktifkan",
  "division.created": "Divisi dibuat",
  "division.updated": "Divisi diubah",
  "division.activated": "Divisi diaktifkan kembali",
  "division.deactivated": "Divisi dinonaktifkan",
  "organization.created": "Organisasi dibuat",
  "organization.updated": "Organisasi diubah",
  "organization.activated": "Organisasi diaktifkan kembali",
  "organization.deactivated": "Organisasi dinonaktifkan",
  "organization.deleted": "Organisasi dihapus permanen",
};

// Audit log organisasi pemanggil.
export function listAuditLogs(filter: AuditFilter) {
  return apiList<AuditLog>("/audit-logs", { ...filter });
}

// Audit log semua organisasi (super admin), termasuk organisasi yang sudah
// dihapus permanen.
export function listPlatformAuditLogs(filter: AuditFilter) {
  return apiList<AuditLog>("/platform/audit-logs", { ...filter });
}
