import type { ReactNode } from "react";

interface AlertProps {
  children: ReactNode;
  tone?: "error" | "success";
}

const toneClasses = {
  error: "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300",
  success: "border-green-200 bg-green-50 text-green-700 dark:border-green-900 dark:bg-green-950 dark:text-green-300",
};

const Alert = ({ children, tone = "error" }: AlertProps) => (
  <p
    role={tone === "error" ? "alert" : "status"}
    className={`rounded-field border px-3 py-2 text-sm leading-5 ${toneClasses[tone]}`}
  >
    {children}
  </p>
);

export default Alert;
