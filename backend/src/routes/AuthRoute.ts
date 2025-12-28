import { Router } from "express";
import { userController } from "../features/user/index.js";

class AuthRouter {
    private router: Router;

    constructor() {
        this.router = Router();
    }

    routes() {
        this.router.use("/users", userController.handle());
        return this.router;
    }
}
const authRouter = new AuthRouter();
export default authRouter.routes();
