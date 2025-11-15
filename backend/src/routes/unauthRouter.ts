import { Router } from "express";
import loginController from "../features/login/LoginController.js";

export class UnauthRouter {
    public router: Router;

    constructor() {
        this.router = Router();
        this.routes();
    }

    private routes() {
        this.router.use("/login", loginController);
    }
}

const unauthRouter = new UnauthRouter().router;
export default unauthRouter;
