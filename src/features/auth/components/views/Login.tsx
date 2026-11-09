import { useState, type FormEvent } from "react";
import { Check, LockKeyhole, Mail } from "lucide-react";
import { useNavigate } from "react-router";
import divider from "../../../../assets/login/divider.svg";
import Input from "../../../../components/common/Input/Input";
import Button from "../../../../components/common/Button/Button";
import Alert from "../../../../components/common/Alert/Alert";
import { ApiError } from "../../../../services/api";
import { homePath } from "../../../../routes/homePath";
import { saveSession } from "../../auth.Slice";
import { login } from "../..";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fields, setFields] = useState<Record<string, string>>({});

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setFields({});
    try {
      const result = await login(email, password);
      saveSession(result.access_token, result.user, remember);
      navigate(homePath(), { replace: true });
    } catch (err) {
      const apiError = err instanceof ApiError ? err : null;
      setError(apiError?.message ?? "Terjadi kesalahan pada server");
      setFields(apiError?.fields ?? {});
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="flex flex-col gap-2">
        <h1 className="font-heading text-[28px] leading-9 font-bold text-text-default">
          Masuk ke akun Anda
        </h1>
        <p className="text-base leading-6 text-text-muted">
          Gunakan akun yang telah terdaftar untuk melanjutkan.
        </p>
      </div>
      <img alt="" aria-hidden className="block h-px w-full dark:opacity-20" src={divider} />
      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        {error && <Alert>{error}</Alert>}
        <Input
          label="Email"
          icon={Mail}
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Masukkan email"
          error={fields.email}
        />
        <Input
          label="Kata sandi"
          icon={LockKeyhole}
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          showPasswordToggle
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Masukkan kata sandi"
          error={fields.password}
        />
        <label className="flex cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            className="peer sr-only"
          />
          <span className="flex size-4 items-center justify-center rounded-[4px] border border-neutral-line-strong bg-neutral-surface text-brand-on-primary peer-checked:border-brand-primary peer-checked:bg-brand-primary peer-focus-visible:ring-2 peer-focus-visible:ring-brand-primary/40 [&>svg]:invisible peer-checked:[&>svg]:visible">
            <Check size={16} strokeWidth={1.6} aria-hidden />
          </span>
          <span className="font-inter text-base leading-[1.4] text-text-default">
            Ingat saya
          </span>
        </label>
        <Button type="submit" disabled={loading} className="disabled:cursor-wait disabled:opacity-70">
          {loading ? "Memproses..." : "Masuk"}
        </Button>
        <p className="text-center text-sm text-text-muted">
          Belum punya akun? Hubungi administrator.
        </p>
      </form>
    </>
  );
};

export default Login;
