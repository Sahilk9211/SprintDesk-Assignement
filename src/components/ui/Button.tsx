// src/components/ui/Button.tsx
import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  isLoading?: boolean;
  children: ReactNode;
}

const variantClasses: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary: `bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500`,
  secondary: `bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-dark-elevated dark:text-dark-text dark:hover:bg-dark-hover`,
  danger: `bg-red-600 text-white hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-500`,
  ghost: `bg-transparent text-gray-700 hover:bg-gray-100 dark:text-dark-muted dark:hover:bg-dark-hover dark:hover:text-dark-text
  `,
};
export default function Button({
  variant = "primary",
  isLoading = false,
  disabled,
  children,
  className = "",
  ...rest
}: ButtonProps) {
  return (
    <button
      disabled={disabled || isLoading}
      className={`rounded-md px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${variantClasses[variant]} ${className}
      `}
      {...rest}
    >
      {isLoading ? "Loading..." : children}
    </button>
  );
}
