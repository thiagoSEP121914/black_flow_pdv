import { api } from "@/shared/api";

interface LoginResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

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
}
