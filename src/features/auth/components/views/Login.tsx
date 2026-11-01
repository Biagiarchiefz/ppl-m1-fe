import { useState, type FormEvent } from "react";
import { Check, LockKeyhole, Mail } from "lucide-react";
import { Link, useNavigate } from "react-router";
import divider from "../../../../assets/login/divider.svg";
import Input from "../../../../components/common/Input/Input";
import Button from "../../../../components/common/Button/Button";

const Login = () => {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    localStorage.setItem("auth_token", "demo-token");
    navigate("/dashboard");
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
      <img alt="" aria-hidden className="block h-px w-full" src={divider} />
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Email atau nama pengguna"
          icon={Mail}
          id="identifier"
          name="identifier"
          autoComplete="username"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          placeholder="Masukkan email atau nama pengguna"
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
        />
        <div className="flex items-center justify-between">
          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="peer sr-only"
            />
            <span className="flex size-4 items-center justify-center rounded-[4px] border border-[#757575] bg-white peer-checked:border-[#2c2c2c] peer-checked:bg-[#2c2c2c] peer-focus-visible:ring-2 peer-focus-visible:ring-brand-primary/40 [&>svg]:invisible peer-checked:[&>svg]:visible">
              <Check size={16} strokeWidth={1.6} aria-hidden />
            </span>
            <span className="font-inter text-base leading-[1.4] text-[#1e1e1e]">
              Ingat saya
            </span>
          </label>
          <a href="#" className="text-sm leading-[22px] text-brand-primary hover:underline">
            Lupa kata sandi?
          </a>
        </div>
        <Button
          type="submit"
        >
          Masuk
        </Button>
        <p className="flex items-center justify-center gap-1 text-sm text-text-muted">
          Belum punya akun?
          <Link to="/register" className="font-semibold text-brand-primary hover:underline">
            Daftar
          </Link>
        </p>
      </form>
    </>
  );
};

export default Login;