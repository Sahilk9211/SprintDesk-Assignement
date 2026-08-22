// src/components/ui/Select.tsx
import type { SelectHTMLAttributes } from "react";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: SelectOption[];
}

export default function Select({
  label,
  options,
  id,
  className = "",
  ...rest
}: SelectProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1 block text-sm font-medium text-gray-700 dark:text-dark-text
        "
      >
        {label}
      </label>

      <select
        id={id}
        className={`w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-dark-border dark:bg-dark-elevated dark:text-dark-text
          ${className}
        `}
        {...rest}
      >
        {options.map((opt) => (
          <option
            key={opt.value}
            value={opt.value}
            className="bg-white text-gray-900 dark:bg-dark-elevated dark:text-dark-text"
          >
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
