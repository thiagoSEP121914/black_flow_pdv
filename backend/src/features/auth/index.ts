import { AuthService } from "./AuthService.js";
import { AuthController } from "./AuthController.js";
import { userService } from "../user/index.js";
import { companyService } from "../company/index.js";

const authService = new AuthService(userService, companyService);
const authController = new AuthController(authService);

export { authService, authController };
