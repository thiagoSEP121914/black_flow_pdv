// src/core/env.ts
function getEnvVar(key: string): string {
  const value = process.env[key];
  if (!value) throw new Error(`Missing environment variable: ${key}`);
  return value;
}

export const env = {
  jwt: {
    accessSecret: getEnvVar("JWT_ACCESS_SECRET"),
    refreshSecret: getEnvVar("JWT_REFRESH_SECRET"),
    accessExpiresIn: getEnvVar("ACCESS_EXPIRES_IN"),   // ex: "15m"
    refreshExpiresIn: getEnvVar("REFRESH_EXPIRES_IN"), // ex: "7d"
  },
  port: process.env.PORT ? Number(process.env.PORT) : 8080,
};
