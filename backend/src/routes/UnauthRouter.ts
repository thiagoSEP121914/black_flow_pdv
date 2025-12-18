import { Router } from "express";
import authController from "../features/auth/AuthController.js";

class UnauthRouter {
    public router: Router;

    constructor() {
        this.router = Router();
    }

    routes() {
        this.router.use("/", authController);

        return this.router;
    }
}

const unauthRouter = new UnauthRouter();
export default unauthRouter.routes();
