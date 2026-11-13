import { ArrowRight, Check, LockKeyhole, Mail } from "lucide-react";
import Input from "../../../../components/common/Input/Input";
import Button from "../../../../components/common/Button/Button";
import Alert from "../../../../components/common/Alert/Alert";
import { useLogin } from "../../hooks/useLogin";

const Login = () => {
  const { register, errors, error, loading, onSubmit } = useLogin();

  return (
    <>
      <header>
        <h1 className="mt-2 text-2xl leading-tight font-medium text-text-strong">Selamat datang kembali</h1>
        <p className="mt-1.5 text-sm leading-relaxed text-text-muted">
          Masuk dengan akun yang telah didaftarkan administrator.
        </p>
      </header>

      <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-4" noValidate>
        {error && <Alert>{error}</Alert>}
        <Input
          label="Email"
          icon={Mail}
          id="email"
          type="email"
          autoComplete="username"
          placeholder="nama@perusahaan.com"
          error={errors.email?.message}
          {...register("email")}
        />
        <Input
          label="Kata sandi"
          icon={LockKeyhole}
          id="password"
          type="password"
          autoComplete="current-password"
          showPasswordToggle
          placeholder="Masukkan kata sandi"
          error={errors.password?.message}
          {...register("password")}
        />
        <label className="flex min-h-9 cursor-pointer items-center gap-2.5 self-start">
          <input type="checkbox" className="peer sr-only" {...register("remember")} />
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
