import { Router } from "express";
// middlewares ,token jwt autenticação por role

class AuthRouter {
    private router: Router;

    constructor() {
        this.router = Router();
    }

    routes() {
        this.router.use();

        return this.router;
    }
}
const authRouter = new AuthRouter();
export default authRouter.routes();
