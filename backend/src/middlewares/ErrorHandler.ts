// src/middleware/errorHandler.ts
import { Request, Response, NextFunction } from "express";
import { NotFoundError } from "../errors/NotFounError.js";
import { ConflictError } from "../errors/ConflictError.js";
import { logger } from "../utils/logger.js";
import { UnauthorizedError } from "../errors/UnauthorizedError.js";

export function errorHandler(error: any, req: Request, res: Response, _next: NextFunction) {
    // Loga todos os erros
    logger.error(error);

    if (error instanceof UnauthorizedError) {
        return res.status(401).json({
            error: error.message,
            code: "UNAUTHORIZED",
        });
    }

    if (error instanceof NotFoundError) {
        return res.status(404).json({
            error: error.message,
            code: "NOT_FOUND",
        });
    }

    if (error instanceof ConflictError) {
        return res.status(409).json({
            error: error.message,
            code: "CONFLICT",
        });
    }

    // Erros de autenticação/validação podem ser tratados aqui também
    if (error.status && error.message) {
        return res.status(error.status).json({
            error: error.message,
            code: error.code || "ERROR",
        });
    }

    // Qualquer outro erro inesperado
    return res.status(500).json({
        error: "Erro interno do servidor",
        code: "INTERNAL_ERROR",
    });
}
