import { useState, type FormEvent } from "react";
import { LockKeyhole, Mail, UserRound } from "lucide-react";
import { Link, useNavigate } from "react-router";
import divider from "../../../../assets/login/divider.svg";
import Input from "../../../../components/common/Input/Input";
import Button from "../../../../components/common/Button/Button";

const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [passwordError, setPasswordError] = useState("");

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (password !== passwordConfirmation) {
      setPasswordError("Konfirmasi kata sandi tidak cocok.");
      return;
    }
    setPasswordError("");
    navigate("/login");
  }

  return (
    <>
      <div className="flex flex-col gap-2">
        <h1 className="font-heading text-[28px] leading-9 font-bold text-text-default">
          Buat akun baru
        </h1>
        <p className="text-base leading-6 text-text-muted">
          Lengkapi data berikut untuk membuat akun Anda.
        </p>
      </div>
      <img alt="" aria-hidden className="block h-px w-full" src={divider} />
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input label="Nama lengkap" icon={UserRound} id="name" name="name" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Masukkan nama lengkap" />
        <Input label="Email" icon={Mail} id="email" name="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Masukkan email" />
        <Input label="Kata sandi" icon={LockKeyhole} id="password" name="password" type="password" autoComplete="new-password" showPasswordToggle value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Masukkan kata sandi" />
        <Input label="Konfirmasi kata sandi" icon={LockKeyhole} id="password-confirmation" name="password-confirmation" type="password" autoComplete="new-password" showPasswordToggle value={passwordConfirmation} onChange={(e) => setPasswordConfirmation(e.target.value)} placeholder="Ulangi kata sandi" />
        {passwordError && <p role="alert" className="text-sm text-red-600">{passwordError}</p>}
        <Button type="submit">
          Daftar
        </Button>
        <p className="flex items-center justify-center gap-1 text-sm text-text-muted">
          Sudah punya akun?
          <Link to="/login" className="font-semibold text-brand-primary hover:underline">Masuk</Link>
        </p>
      </form>
    </>
  );
};

export default Register;