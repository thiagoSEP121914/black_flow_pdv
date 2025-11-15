import express from "express";
import { config } from "dotenv";
import unauthRouter from "./routes/unauthRouter.js";

config();
const server = express();
const PORT = 8080;
server.use(express.json());
server.get("/", (req, res) => {
    res.json("Hello world");
});

server.use("/", unauthRouter);

server.listen(PORT, () => {
    console.log(`Server is running on the ${PORT}`);
});
