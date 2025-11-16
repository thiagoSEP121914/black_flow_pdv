import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

interface IInputProps {
  label?: string;
  type?: "text" | "email" | "password" | "number" | "tel" | "date";
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  icon?: React.ReactNode;
  maxLength?: number;
  min?: string | number;
  max?: string | number;
}

export function Input({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  required = false,
  disabled = false,
  className = "",
  icon,
  maxLength,
  min,
  max,
}: IInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const inputType = type === "password" && showPassword ? "text" : type;

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}

        <input
          type={inputType}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          maxLength={maxLength}
          min={min}
          max={max}
          className={`
            w-full px-4 py-3 
            ${icon ? "pl-10" : ""} 
            ${type === "password" ? "pr-10" : ""}
            border-2 rounded-lg 
            transition-all duration-200
            ${
              error
                ? "border-red-500 focus:border-red-600 focus:ring-2 focus:ring-red-200"
                : isFocused
                  ? "border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                  : "border-gray-300 hover:border-gray-400"
            }
            ${disabled ? "bg-gray-100 cursor-not-allowed" : "bg-white"}
            focus:outline-none
            text-gray-900
            placeholder:text-gray-400
          `}
        />

        {type === "password" && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
      </div>

      {error && (
        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
          <span className="font-medium">⚠</span>
          {error}
        </p>
      )}
    </div>
  );
}

// EXEMPLO DE USO:
/*
import { Mail, Lock, User, Building2, Phone } from "lucide-react";

const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [name, setName] = useState("");

<Input
  label="Email"
  type="email"
  placeholder="seu@email.com"
  value={email}
  onChange={setEmail}
  icon={<Mail size={20} />}
  required
  error={emailError}
/>

<Input
  label="Senha"
  type="password"
  placeholder="Digite sua senha"
  value={password}
  onChange={setPassword}
  icon={<Lock size={20} />}
  required
/>

<Input
  label="Nome Completo"
  type="text"
  placeholder="Seu nome"
  value={name}
  onChange={setName}
  icon={<User size={20} />}
  required
/>
*/
