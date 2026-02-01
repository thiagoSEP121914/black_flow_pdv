import { Router } from "express";
import { userController } from "../features/User/index.js";
import { companyController } from "../features/Company/index.js";
import { productController } from "../features/Product/index.js";

class AuthRouter {
    private router: Router;

    constructor() {
        this.router = Router();
    }

    routes() {
        this.router.use("/users", userController.handle());
        this.router.use("/companies", companyController.handle());
        this.router.use("/products", productController.handle());
        return this.router;
    }
}
const authRouter = new AuthRouter();
export default authRouter.routes();
