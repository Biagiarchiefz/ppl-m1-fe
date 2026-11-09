import type { ChangeEvent } from "react";

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  label: string;
  id: string;
  value: string;
  options: SelectOption[];
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  placeholder?: string;
  error?: string;
}

const Select = ({ label, id, value, options, onChange, placeholder, error }: SelectProps) => (
  <div className="flex flex-col gap-2">
    <label htmlFor={id} className="text-sm leading-5 font-semibold text-text-default">
      {label}
    </label>
    <select
      id={id}
      value={value}
      onChange={onChange}
      aria-invalid={Boolean(error)}
      className={`h-10 rounded-field border bg-neutral-surface px-3 text-sm text-text-default outline-none focus:ring-2 ${error ? "border-danger focus:ring-danger/20" : "border-neutral-line-strong focus:border-brand-primary focus:ring-brand-primary/20"}`}
    >
      {placeholder !== undefined && <option value="">{placeholder}</option>}
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
    {error && <p className="text-xs leading-5 text-danger">{error}</p>}
  </div>
);

export default Select;
