import { createContext } from "react";
import type { User } from "../types/LoginResponse";
import type { LoginInput } from "../schemas/login.schema";

export interface AuthContextData {
  user: User | null;
  isAuthenticated: boolean;
  login(data: LoginInput): Promise<void>;
  logout(): void;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextData>(
  {} as AuthContextData
);
