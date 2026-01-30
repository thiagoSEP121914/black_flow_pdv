import { useState, useMemo, useEffect, useCallback } from "react";
import type { User } from "../types/LoginResponse";
import { AuthContext } from "./AuthContextData";
import { AuthRepository } from "../repository/AuthRepository";
import type { LoginInput } from "../schemas/login.schema";
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        return JSON.parse(storedUser);
      } catch {
        return null;
      }
    }
    return null;
  });

  const [loading, setLoading] = useState(!user);

  const authRepository = useMemo(() => new AuthRepository(), []);

  const logout = useCallback(async () => {
    try {
      await authRepository.logout();
    } finally {
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      setUser(null);
    }
  }, [authRepository]);

  useEffect(() => {
    // 3. Validação de segurança em background
    const validateToken = async () => {
      const token = localStorage.getItem("accessToken");
      if (token && !user) {
        try {
          const userData = await authRepository.me();
          setUser(userData);
        } catch (error) {
          console.log(error);
          logout();
        }
      }
      setLoading(false);
    };

    validateToken();
  }, [user, logout, authRepository]);

  async function login(data: LoginInput) {
    const response = await authRepository.login(data.email, data.password);
    localStorage.setItem("accessToken", response.accessToken);
    localStorage.setItem("refreshToken", response.refreshToken);

    const user = await authRepository.me();

    localStorage.setItem("user", JSON.stringify(user));
    setUser(user);
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
