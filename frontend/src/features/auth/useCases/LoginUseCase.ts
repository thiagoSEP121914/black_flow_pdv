import type { AuthRepository } from "../repository/AuthRepository";
import {
  loginSchema,
  type LoginInput,
} from "@/features/auth/schemas/login.schema";

export class LoginUseCase {
  private authRepository: AuthRepository;

  constructor(authRepository: AuthRepository) {
    this.authRepository = authRepository;
  }

  async execute(input: LoginInput) {
    const parsed = loginSchema.safeParse(input);

    if (!parsed.success) {
      const message = parsed.error.issues[0].message;
      throw new Error(message);
    }

    const { email, password } = parsed.data;
    const response = await this.authRepository.login(email, password);

    localStorage.setItem("token", response.token);
    localStorage.setItem("user", JSON.stringify(response.user));
    return response.user;
  }
}
