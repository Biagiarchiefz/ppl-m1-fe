import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "w-full cursor-pointer rounded-field bg-brand-primary p-3 text-sm leading-[22px] font-bold text-brand-on-primary transition-colors hover:bg-[#1a3567] focus-visible:ring-2 focus-visible:ring-brand-primary/40 focus-visible:ring-offset-2 focus-visible:outline-none",
  ghost:
    "flex size-5 shrink-0 cursor-pointer items-center justify-center focus-visible:ring-2 focus-visible:ring-brand-primary/40 focus-visible:outline-none",
};

const Button = ({
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) => (
  <button
    {...props}
    className={`${variantClasses[variant]} ${className}`.trim()}
  />
);

export default Button;