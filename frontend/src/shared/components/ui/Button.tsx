// src/shared/components/ui/button.tsx
import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "destructive";
  size?: "xs" | "sm" | "md" | "lg" | "icon";
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  className = "",
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-primary",
    secondary:
      "bg-secondary text-secondary-foreground hover:bg-secondary/80 focus:ring-secondary",
    ghost:
      "bg-transparent text-foreground hover:bg-secondary/50 focus:ring-primary",
    destructive:
      "bg-destructive text-destructive-foreground hover:bg-destructive/90 focus:ring-destructive",
  };

  const sizes = {
    xs: "w-8 h-8 p-1.5", // Novo tamanho menor
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
    icon: "w-10 h-10 p-2",
  };

  const variantClass = variants[variant];
  const sizeClass = sizes[size];

  return (
    <button
      {...props}
      className={`${baseStyles} ${variantClass} ${sizeClass} ${className}`}
    />
  );
};

export default Button;
