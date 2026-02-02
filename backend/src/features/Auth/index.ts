import { AuthService } from "./AuthService.js";
import { AuthController } from "./AuthController.js";
import { userService } from "../User/index.js";
import { companyService } from "../Company/index.js";
import { sessionService } from "../Session/index.js";

const authService = new AuthService(userService, companyService, sessionService);
const authController = new AuthController(authService);

export { authService, authController };
