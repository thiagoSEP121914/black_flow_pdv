import express from "express";
import { config } from "dotenv";
import router from "./routes/route.js";

config();
const server = express();
const PORT = 8080;
server.use(express.json());
server.get("/", (req, res) => {
    res.json("Hello world");
});

server.use("/", router);

server.listen(PORT, () => {
    console.log(`Server is running on the ${PORT}`);
});
