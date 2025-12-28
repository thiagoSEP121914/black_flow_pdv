import { AppError } from "./AppError.js";

export class UnauthorizedError extends AppError {
    constructor(message: string) {
        super(message);
        this.name = "Unauthorized";
    }
}
