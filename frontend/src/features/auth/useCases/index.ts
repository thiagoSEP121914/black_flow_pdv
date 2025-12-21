import { AuthRepository } from "../repository/AuthRepository"; // sua implementação concreta
import { LoginUseCase } from "./LoginUseCase";
import { LogoutUseCase } from "./LogoutUseCase";

const authRepository = new AuthRepository();
export const loginUseCase = new LoginUseCase(authRepository);
export const logoutUseCase = new LogoutUseCase(authRepository);
