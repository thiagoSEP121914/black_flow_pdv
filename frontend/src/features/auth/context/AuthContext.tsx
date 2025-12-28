import { useState, useMemo, useEffect } from "react";
import type { User } from "../types/LoginResponse";
import { AuthContext } from "./AuthContextData";
import { AuthRepository } from "../repository/AuthRepository";
import type { LoginInput } from "../schemas/login.schema";
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const authRepository = useMemo(() => new AuthRepository(), []);

  // Inicializa o usuário do localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.warn("Erro ao ler usuário do localStorage:", err);
      }
    }
    setLoading(false);
  }, []);

  async function login(data: LoginInput) {
    const response = await authRepository.login(data.email, data.password);

    localStorage.setItem("user", JSON.stringify(response.user));
    localStorage.setItem("token", response.token);

    setUser(response.user);
  }

  async function logout() {
    try {
      await authRepository.logout();
    } finally {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      setUser(null);
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
