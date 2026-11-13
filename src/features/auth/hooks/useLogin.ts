import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router";
import { homePath } from "../../../routes/homePath";
import { applyServerErrors } from "../../../utils/formErrors";
import { login } from "../services/auth.service";
import { loginSchema } from "../schemas/auth.schema";
import { useAuthStore } from "../stores/auth.store";
import type { LoginForm } from "../../../types";

// Form masuk: kirim ke /auth/login, simpan sesi di store, lalu arahkan ke
// halaman awal sesuai izin pengguna.
export function useLogin() {
  const navigate = useNavigate();
  const saveSession = useAuthStore((s) => s.login);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginForm>({
    defaultValues: { email: "", password: "", remember: true },
    resolver: zodResolver(loginSchema),
  });

  const mutation = useMutation({
    mutationFn: ({ email, password }: LoginForm) => login(email, password),
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      const result = await mutation.mutateAsync(values);
      saveSession(result.access_token, result.user, values.remember);
      navigate(homePath(), { replace: true });
    } catch (err) {
      applyServerErrors(err, setError);
    }
  });

  return {
    register,
    errors,
    error: errors.root?.server?.message,
    loading: mutation.isPending,
    onSubmit,
  };
}
