import { Router } from "express";
import { authController } from "../features/Auth/index.js";

class UnauthRouter {
    public router: Router;

    constructor() {
        this.router = Router();
    }

    routes() {
        this.router.use("/", authController.handle());

        return this.router;
    }
}

const unauthRouter = new UnauthRouter();
export default unauthRouter.routes();
