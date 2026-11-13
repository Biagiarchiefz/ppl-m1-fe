import { useState, type FormEvent } from "react";
import { ArrowRight, Check, LockKeyhole, Mail } from "lucide-react";
import { useNavigate } from "react-router";
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
      <header>
        <p className="text-xs font-semibold tracking-[0.06em] text-brand-primary uppercase">Panel M1</p>
        <h1 className="mt-2 text-2xl leading-tight font-medium text-text-strong">Selamat datang kembali</h1>
        <p className="mt-1.5 text-sm leading-relaxed text-text-muted">
          Masuk dengan akun yang telah didaftarkan administrator.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4" noValidate>
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
          placeholder="nama@perusahaan.com"
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
        <label className="flex min-h-9 cursor-pointer items-center gap-2.5 self-start">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            className="peer sr-only"
          />
          <span className="flex size-[18px] items-center justify-center rounded-[5px] border border-neutral-line-strong bg-neutral-surface text-brand-on-primary transition-colors duration-150 peer-checked:border-brand-primary peer-checked:bg-brand-primary peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand-accent [&>svg]:invisible peer-checked:[&>svg]:visible">
            <Check size={14} strokeWidth={2} aria-hidden />
          </span>
          <span className="text-sm text-text-default">Ingat saya</span>
        </label>
        <Button type="submit" loading={loading} className="mt-1">
          {loading ? "Memproses..." : "Masuk"}
          {!loading && (
            <ArrowRight
              size={16}
              strokeWidth={1.5}
              aria-hidden
              className="transition-transform duration-150 group-hover:translate-x-0.5 motion-reduce:transition-none"
            />
          )}
        </Button>
      </form>

      <div className="mt-8 rounded-field bg-neutral-soft px-3.5 py-3 text-sm leading-relaxed text-text-muted">
        Belum punya akun atau lupa kata sandi? Hubungi administrator organisasi Anda.
      </div>
    </>
  );
};

export default Login;
