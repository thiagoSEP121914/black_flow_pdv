import { AppError } from "../errors/AppError.js";
import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
    NODE_ENV: z.enum(["developmente", "production", "test"]),
    PORT: z.coerce.number().default(8080),
    API_URL: z.string().default("http://localhost8080"),
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
