import bcrypt from "bcryptjs";
import { env } from "../core/env.js";
import { promises } from "dns";

const SALT_ROUNDS = env.PASSWORD_ROUNDS;

export async function hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, SALT_ROUNDS);
}

export async function comparePasword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
}
