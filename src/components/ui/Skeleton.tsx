type SkeletonVariant = "text" | "circle" | "rect";

interface SkeletonProps {
  variant?: SkeletonVariant;
  width?: string;
  height?: string;
  className?: string;
}

const variantClasses: Record<SkeletonVariant, string> = {
  text: "rounded",
  circle: "rounded-full",
  rect: "rounded-md",
};

export default function Skeleton({
  variant = "text",
  width = "100%",
  height = "1rem",
  className = "",
}: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={`animate-pulse bg-gray-200 dark:bg-dark-elevated ${variantClasses[variant]} ${className} `}
      style={{ width, height }}
    />
  );
}
