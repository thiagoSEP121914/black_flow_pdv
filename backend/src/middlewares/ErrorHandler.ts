import { Request, Response } from "express";
import { AppError } from "../errors/AppError.js";

export function errorHandler(error: Error, req: Request, res: Response): Response {
    if (error instanceof AppError) {
        return res.status(400).json({ status: "error", message: error.message });
    }

    return res.status(500).json({ status: "error", message: "Internal server error" });
}
