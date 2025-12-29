import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export const Input: React.FC<InputProps> = ({ className = "", ...props }) => {
  return (
    <input
      {...props}
      className={`px-3 py-2 rounded-md border border-gray-200 bg-transparent text-sm text-foreground placeholder:text-muted-foreground ${className}`}
    />
  );
};

export default Input;
