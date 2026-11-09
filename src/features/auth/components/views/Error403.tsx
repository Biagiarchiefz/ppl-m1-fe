import { ShieldOff } from "lucide-react";
import ErrorView from "./ErrorView";

const Error403 = () => (
  <ErrorView
    code="403"
    title="Forbidden Access"
    description="Anda tidak memiliki izin untuk mengakses halaman ini. Silakan hubungi administrator jika Anda merasa ini adalah kesalahan."
    icon={ShieldOff}
  />
);

export default Error403;
