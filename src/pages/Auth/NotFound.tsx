import { FileQuestion } from "lucide-react";
import ErrorView from "../../features/auth/components/views/ErrorView";

const NotFound = () => (
  <ErrorView
    code="404"
    title="Halaman tidak ditemukan"
    description="Alamat yang Anda buka tidak tersedia atau sudah dipindahkan."
    icon={FileQuestion}
  />
);

export default NotFound;
