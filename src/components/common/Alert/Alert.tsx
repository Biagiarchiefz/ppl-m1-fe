import type { ReactNode } from "react";
import { CircleAlert, CircleCheck } from "lucide-react";

interface AlertProps {
  children: ReactNode;
  tone?: "error" | "success";
}

const toneClasses = {
  error: "border-danger/20 bg-danger-soft text-danger",
  success: "border-success/20 bg-success-soft text-success",
};

const Alert = ({ children, tone = "error" }: AlertProps) => {
  const Icon = tone === "error" ? CircleAlert : CircleCheck;
  return (
    <p
      role={tone === "error" ? "alert" : "status"}
      className={`flex items-start gap-2.5 rounded-field border px-3.5 py-2.5 text-sm leading-5 ${toneClasses[tone]}`}
    >
      <Icon size={16} strokeWidth={1.5} aria-hidden className="mt-0.5 shrink-0" />
      <span className="min-w-0">{children}</span>
    </p>
  );
};

export default Alert;
