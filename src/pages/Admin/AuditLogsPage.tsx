import AdminLayout from "../../layouts/AdminLayout";
import AuditLogs from "../../features/audit/components/views/AuditLogs";
import type { AuditScope } from "../../types";

const AuditLogsPage = ({ scope = "organization" }: { scope?: AuditScope }) => (
  <AdminLayout>
    <AuditLogs scope={scope} />
  </AdminLayout>
);

export default AuditLogsPage;
