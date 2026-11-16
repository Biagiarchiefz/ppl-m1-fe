import type { ReactNode } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "../config/queryClient";
import Toaster from "../components/common/Toaster/Toaster";

// Semua provider tingkat aplikasi disusun di sini agar main.tsx tetap ringkas.
// State global klien ada di src/store (zustand); provider baru (mis. i18n)
// cukup ditambahkan di sini.
const AppProviders = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    {children}
    <Toaster />
  </QueryClientProvider>
);

export default AppProviders;
