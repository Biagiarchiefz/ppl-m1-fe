import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router";
import { homePath } from "../../../routes/homePath";
import { applyServerErrors } from "../../../utils/formErrors";
import { getMe, login } from "../services/auth.service";
import { loginSchema } from "../schemas/auth.schema";
import { selectLogin, useAuthStore } from "../../../store";
import type { LoginForm } from "../../../types";

// Form masuk: POST /auth/login hanya mengembalikan token, jadi profil
// (termasuk is_super_admin) diambil dari GET /me sebelum sesi disimpan.
export function useLogin() {
  const navigate = useNavigate();
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
    try {
      const result = await mutation.mutateAsync(values);
      saveSession(result.token, result.user, values.remember);
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
