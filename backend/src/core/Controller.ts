import { Router } from "express";

export abstract class Controller {
    protected route = Router();

    abstract handle(): Router;
}
