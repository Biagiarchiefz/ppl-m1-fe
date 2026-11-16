// Peran global & katalog izin.

export interface Role {
  id: number;
  partner_id: number | null;
  code: string;
  name: string;
  description: string | null;
  is_active: boolean;
  created_at: string;
}

export interface Permission {
  code: string;
  module: string;
  description: string;
}

export interface CreateRoleInput {
  code: string;
  name: string;
  description?: string;
  permission_codes: string[];
}

export interface RolePermissions {
  role_id: number;
  permission_codes: string[];
}

// edit = mengganti daftar izin peran (PUT /roles/{id}/permissions).
export type RoleDialog = { kind: "create" } | { kind: "edit"; role: Role } | null;

export interface RoleForm {
  code: string;
  name: string;
  description: string;
  permissions: string[];
}
