import { Router } from "express";
import AuthController from "../features/auth/AuthController.js";

export class UnauthRouter {
    public router: Router;

    constructor() {
        this.router = Router();
        this.routes();
    }

    private routes() {
        this.router.use("/unauth", AuthController);
    }
}

const unauthRouter = new UnauthRouter().router;
export default unauthRouter;
