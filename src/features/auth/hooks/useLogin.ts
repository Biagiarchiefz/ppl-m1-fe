import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation, useNavigate, useSearchParams } from "react-router";
import { redirectAfterLogin, targetFrom } from "../../../routes/homePath";
import { applyServerErrors } from "../../../utils/formErrors";
import { getMe, login } from "../services/auth.service";
import { loginSchema } from "../schemas/auth.schema";
import { selectLogin, useAuthStore } from "../../../store";
import type { LoginForm } from "../../../types";

// Form masuk: POST /auth/login hanya mengembalikan token, jadi profil
// (termasuk is_super_admin) diambil dari GET /me sebelum sesi disimpan.
export function useLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  // Tujuan setelah login: dari ProtectedRoute (state.from) atau dari redirect
  // 401 di api.ts (?next=).
  const target = targetFrom(location.state, searchParams.get("next"));
  const sessionExpired = searchParams.get("sesi") === "berakhir";
  const saveSession = useAuthStore(selectLogin);
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
    mutationFn: async ({ email, password }: LoginForm) => {
      const { access_token } = await login(email, password);
      const user = await getMe(access_token);
      return { token: access_token, user };
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    // Hanya galat request (login / GET /me) yang ditampilkan di form; langkah
    // setelahnya tidak boleh terbaca sebagai "kesalahan server".
    let result;
    try {
      result = await mutation.mutateAsync(values);
    } catch (err) {
      applyServerErrors(err, setError);
      return;
    }
    saveSession(result.token, result.user, values.remember);
    navigate(redirectAfterLogin(target, result.user), { replace: true });
  });

  return {
    register,
    errors,
    error: errors.root?.server?.message,
    sessionExpired,
    loading: mutation.isPending,
    onSubmit,
  };
}
