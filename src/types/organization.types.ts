// Organisasi pengguna platform (super admin).

export interface Organization {
  id: number;
  code: string;
  name: string;
  is_active: boolean;
  created_at: string;
}

export interface CreateOrganizationInput {
  code: string;
  name: string;
  admin: { name: string; email: string; password: string };
}

export interface OrganizationForm {
  code: string;
  name: string;
  adminName: string;
  adminEmail: string;
  adminPassword: string;
}

export type OrganizationDialog =
  | { kind: "create" }
  | { kind: "edit"; org: Organization }
  | { kind: "deactivate"; org: Organization }
  | { kind: "activate"; org: Organization }
  | { kind: "delete"; org: Organization }
  | null;
