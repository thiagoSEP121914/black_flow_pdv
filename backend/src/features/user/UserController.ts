import { Router } from "express";
import { Controller } from "../../core/Controller.js";
import { UserService } from "./UserService.js";

export class UserController extends Controller {
    private service: UserService;

    constructor(service: UserService) {
        super();
        this.service = service;
    }

    handle(): Router {
        this.route.get("/", (req, res) => {});
        return this.route;
    }
}
