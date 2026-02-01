import express from "express";
import { config } from "dotenv";
import router from "./routes/route.js";
import cors from "cors";
import { logger } from "./utils/logger.js";
import pinoHttpModule from "pino-http";
import { env } from "./core/env.js";
import { errorHandler } from "./middlewares/ErrorHandler.js";
import helmet from "helmet";

config();
const server = express();

if (env.NODE_ENV !== "production") {
    const { setupSwagger } = await import("./docs/swagger/index.js");
    await setupSwagger(server);
}

server.use(helmet());

const pinoHttp = pinoHttpModule.default;
server.use(pinoHttp({ logger }));
const PORT = env.APP_PORT;

server.use(cors());
server.use(express.json());

server.get("/", (req, res) => {
    res.json("Hello world");
});

server.use("/", router);
server.use(errorHandler);

server.listen(PORT, () => {
    logger.info(`Server is running on the PORT: ${PORT}`);
});
