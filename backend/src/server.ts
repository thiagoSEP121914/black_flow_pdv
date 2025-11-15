import express from "express";
const server = express();
const PORT = 8080;

server.get("/", (req, res) => {
    res.json("Hello world");
});

server.listen(PORT, () => {
    console.log(`Server is running on the ${PORT}`);
});
