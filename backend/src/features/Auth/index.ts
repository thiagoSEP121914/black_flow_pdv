import { AuthService } from "./AuthService.js";
import { AuthController } from "./AuthController.js";
import { userService } from "../User/index.js";
import { companyService } from "../Company/index.js";

const authService = new AuthService(userService, companyService);
const authController = new AuthController(authService);

export { authService, authController };
