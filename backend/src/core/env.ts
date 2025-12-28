import { AppError } from "../errors/AppError.js";
import "dotenv/config";
import { logger } from "../utils/logger.js";
import { z } from "zod";

const envSchema = z.object({
    NODE_ENV: z.enum(["development", "production", "test"]),
    PORT: z.coerce.number().default(8080),
    PASSWORD_ROUNDS: z.coerce.number(),
    API_URL: z.string().default("http://localhost:8080"),
    DATA_BASE_URL: z.string(),
    JWT_ACCESS_SECRET: z.string(),
    JWT_REFRESH_SECRET: z.string(),
    ACCESS_EXPIRES_IN: z.string().default("15m"),
    REFRESH_EXPIRES_IN: z.string().default("7d"),
});

const _env = envSchema.safeParse(process.env);

if (_env.success === false) {
    throw new AppError("Invalid enviroments variable");
}

export const env = _env.data;
