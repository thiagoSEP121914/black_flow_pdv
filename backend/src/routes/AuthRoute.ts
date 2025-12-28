import { Router } from "express";
import { authController } from "../features/auth/index.js";

class AuthRouter {
    private router: Router;

    constructor() {
        this.router = Router();
    }

    routes() {
        this.router.use("/user", authController.handle());
        return this.router;
    }
}
const authRouter = new AuthRouter();
export default authRouter.routes();
