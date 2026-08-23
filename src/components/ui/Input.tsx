import { forwardRef } from "react";
import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hideLabel?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hideLabel, id, className = "", ...rest }, ref) => {
    return (
      <div>
        <label
          htmlFor={id}
          className={
            hideLabel
              ? "sr-only"
              : "mb-1 block text-sm font-medium text-gray-700 dark:text-dark-text"
          }
        >
          {label}
        </label>

        <input
          id={id}
          ref={ref}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`w-full rounded-md border px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500
            ${
              error
                ? "border-red-500 dark:border-red-500"
                : "border-gray-300 dark:border-dark-border"
            } bg-white text-gray-900 placeholder:text-gray-400 dark:bg-dark-elevated dark:text-dark-text dark:placeholder:text-dark-subtle
            ${className}
          `}
          {...rest}
        />

        {error && (
          <p
            id={`${id}-error`}
            role="alert"
            className="mt-1 text-sm text-red-600 dark:text-red-400"
          >
            {error}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

export default Input;
