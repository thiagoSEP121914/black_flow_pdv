import { Router } from "express";
import { authMidlleware } from "../middlewares/authMiddleware.js";
import unauthRouter from "./UnauthRouter.js";
import authRouter from "./AuthRoute.js";

const router = Router();

router.use("/unauth", unauthRouter);
router.use("/auth", authMidlleware, authRouter);

export default router;
