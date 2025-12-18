import { Router } from "express";
import unauthRouter from "./UnauthRouter.js";
import authRouter from "./AuthRoute.js";

const router = Router();

router.use("/unauth", unauthRouter);
router.use("/auth", authRouter);

export default router;
