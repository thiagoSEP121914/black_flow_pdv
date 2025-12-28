import { api } from "@/shared/api";
import type { LoginResponse, User } from "../types/LoginResponse";

export class AuthRepository {
  async login(email: string, password: string): Promise<LoginResponse> {
    const { data } = await api.post<LoginResponse>("/unauth/login", {
      email,
      password,
    });

    return data;
  }

  async logout() {
    await api.post("/unauth/logout");
  }

  async me(): Promise<User> {
    const { data } = await api.get<User>("/auth/users/me");
    return data;
  }
}
