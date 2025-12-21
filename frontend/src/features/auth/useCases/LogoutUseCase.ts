import { AuthRepository } from "../repository/AuthRepository";

export class LogoutUseCase {
  private authRepository: AuthRepository;

  constructor(authRepository: AuthRepository) {
    this.authRepository = authRepository;
  }

  execute() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    this.authRepository.logout();
  }
}
