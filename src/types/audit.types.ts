// Audit log organisasi dan platform.

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

export type AuditScope = "organization" | "platform";
