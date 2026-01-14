import React from "react";

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  variant?: "primary" | "secondary" | "danger" | "ghost" | "transparent";
  size?: "sm" | "md" | "lg";
  tooltip?: string;
}

export const IconButton = ({
  icon,
  variant = "primary",
  size = "md",
  className = "",
  tooltip,
  ...props
}: IconButtonProps) => {
  // Focus logic: focus-visible is better because it avoids the focus ring on mouse clicks,
  // showing it only for keyboard navigation (accessibility).
  const baseStyles =
    "flex items-center justify-center rounded-lg transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer";

  const sizes = {
    sm: "h-8 w-8", // 32px (ideal for tables)
    md: "h-10 w-10", // 40px (default)
    lg: "h-12 w-12", // 48px
  };

  const variants = {
    primary:
      "bg-white border border-gray-200 text-gray-600 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 focus-visible:ring-emerald-500",
    secondary:
      "bg-white border border-gray-200 text-gray-600 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 focus-visible:ring-blue-500",
    danger:
      "bg-white border border-gray-200 text-gray-600 hover:bg-red-50 hover:text-red-500 hover:border-red-200 focus-visible:ring-red-500",
    ghost:
      "bg-transparent text-gray-500 hover:bg-gray-100 hover:text-gray-900 focus-visible:ring-gray-500",
    transparent:
      "bg-transparent text-gray-500 hover:text-gray-700 p-0 h-auto w-auto hover:bg-transparent focus-visible:ring-offset-0",
  };

  return (
    <button
      className={`${baseStyles} ${sizes[size]} ${variants[variant]} ${className}`}
      title={tooltip}
      type="button"
      {...props}
    >
      {icon}
    </button>
  );
};
