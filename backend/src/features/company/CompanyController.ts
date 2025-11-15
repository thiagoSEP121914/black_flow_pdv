import { Router } from "express";
import { Controller } from "../../core/Controller.js";

export class CompanyController extends Controller {
    handle(): Router {
        return this.route;
    }
}
