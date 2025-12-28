import { AppError } from "./AppError.js";

export class ForbiddenError extends AppError {
    constructor(message: string) {
        super(message, 403);
        this.name = "Forbidden";
    }
}
