// Audit log platform (GET /platform/audit-logs, khusus super admin).

// actor_name dan actor_email adalah salinan saat kejadian, jadi tetap
// terisi walau user_id sudah null.
export interface AuditLog {
  id: number;
  partner_id: number | null;
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

// Backend hanya menerima parameter halaman.
export interface AuditFilter {
  page: number;
  per_page?: number;
}
