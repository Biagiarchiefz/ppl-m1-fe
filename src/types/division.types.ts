// Divisi global (partner_id NULL) yang dikelola super admin.

export interface Division {
  id: number;
  partner_id: number | null;
  code: string;
  name: string;
  is_active: boolean;
  created_at: string;
}

// Backend hanya menyediakan tambah divisi (tanpa ubah/nonaktifkan).
export type DivisionDialog = { kind: "create" } | null;

export interface DivisionForm {
  code: string;
  name: string;
}
