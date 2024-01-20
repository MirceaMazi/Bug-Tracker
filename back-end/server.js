import express from "express";
import cookieParser from "cookie-parser";
import cookieEncrpyter from "cookie-encrypter";
import cors from "cors";

import { Database, secretKey } from "./config/index.js";
import appRouter from "./routers/index.js";
import "./models/index.js";
import "./controllers/userController.js";

const port = 1234;

const app = express();
app.use(
    cors({
        origin: ["http://localhost:4200"],
        credentials: true,
    })
);
app.use(express.json());
app.use(cookieParser(secretKey));
app.use(cookieEncrpyter(secretKey));

app.use("/api", appRouter);

app.get("/db-reset", async (req, res) => {
    try {
        await Database.sync({ force: true });
        res.clearCookie("auth");
        res.status(200).send("Database reset success!");
    } catch (error) {
        res.status(500).send("Database reset error! Error: " + error.message);
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}!`);
});
