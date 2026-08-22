// src/components/ui/Badge.tsx
import type { ReactNode } from "react";

type BadgeColor = "gray" | "green" | "yellow" | "red" | "blue";

interface BadgeProps {
  color?: BadgeColor;
  children: ReactNode;
}

const colorClasses: Record<BadgeColor, string> = {
  gray: `
    bg-gray-100 text-gray-800
    dark:bg-gray-700 dark:text-gray-200
  `,
  green: `
    bg-green-100 text-green-800
    dark:bg-green-900/40 dark:text-green-300
  `,
  yellow: `
    bg-yellow-100 text-yellow-900
    dark:bg-yellow-900/40 dark:text-yellow-300
  `,
  red: `
    bg-red-100 text-red-800
    dark:bg-red-900/40 dark:text-red-300
  `,
  blue: `
    bg-blue-100 text-blue-800
    dark:bg-blue-900/40 dark:text-blue-300
  `,
};

export default function Badge({ color = "gray", children }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium transition-colors ${colorClasses[color]}
      `}
    >
      {children}
    </span>
  );
}
