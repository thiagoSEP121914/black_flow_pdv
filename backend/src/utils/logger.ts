import pino from "pino";

export const logger = pino({
    transport: {
        target: "pino-pretty",
        options: { colorizer: true, translateTime: "SYS:stardard" },
    },
});
