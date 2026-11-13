// Peran & izin organisasi.

export interface Role {
  id: number;
  code: string;
  name: string;
  description: string | null;
  is_system: boolean;
  is_active: boolean;
  permissions: string[];
  created_at: string;
}

export interface Permission {
  code: string;
  module: string;
  description: string;
}

export interface RoleInput {
  code?: string;
  name: string;
  description: string | null;
  permissions: string[];
}

export type RoleDialog = { kind: "create" } | { kind: "edit"; role: Role } | { kind: "deactivate" | "activate"; role: Role } | null;

export interface RoleForm {
  code: string;
  name: string;
  description: string;
  permissions: string[];
}
