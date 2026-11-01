import { useState, type ChangeEvent } from "react";
import { Eye, EyeOff, type LucideIcon } from "lucide-react";
import Button from "../Button/Button";

interface PropTypes {
  label: string;
  icon?: LucideIcon;
  id?: string;
  name?: string;
  type?: string;
  autoComplete?: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  showPasswordToggle?: boolean;
}

const Input = (props: PropTypes) => {
  const {
    label,
    icon,
    id = "identifier",
    name = "identifier",
    type = "text",
    autoComplete,
    value,
    onChange,
    placeholder,
    showPasswordToggle = false,
  } = props;
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const isPassword = type === "password";
  const inputType =
    isPassword && showPasswordToggle && isPasswordVisible ? "text" : type;
  const Icon = icon;
  const PasswordToggleIcon = isPasswordVisible ? EyeOff : Eye;

  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={id}
        className="text-sm leading-5 font-semibold text-text-default"
      >
        {label}
      </label>
      <div className="flex h-10 items-center gap-3 rounded-field border border-neutral-line-strong bg-neutral-surface px-3 focus-within:border-brand-primary focus-within:ring-2 focus-within:ring-brand-primary/20">
        {Icon && (
          <span className="flex size-5 shrink-0 items-center justify-center">
            <Icon size={20} strokeWidth={1.6} aria-hidden />
          </span>
        )}
        <input
          id={id}
          name={name}
          type={inputType}
          autoComplete={autoComplete}
          required
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="min-w-0 flex-1 bg-transparent text-sm leading-[22px] text-text-default outline-none placeholder:text-text-muted"
        />
        {isPassword && showPasswordToggle && (
          <Button
            variant="ghost"
            type="button"
            aria-label={
              isPasswordVisible ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"
            }
            aria-pressed={isPasswordVisible}
            onClick={() => setIsPasswordVisible((visible) => !visible)}
          >
            <PasswordToggleIcon size={20} strokeWidth={1.6} aria-hidden />
          </Button>
        )}
      </div>
    </div>
  );
};

export default Input;
