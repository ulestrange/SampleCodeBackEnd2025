import express, { Application, Request, Response } from "express";
import morgan from "morgan";
import userRoutes from './routes/users';
import dotenv from 'dotenv';
import { initDb } from './database';
import { authenticateKey } from "./middleware/auth.middleware";



export const app: Application = express();

initDb()

app.use(express.json());


app.get("/ping", async (_req: Request, res: Response) => {
    res.json({
        message: "hello from Una",
    });
});


//app.use(authenticateKey);
app.use(morgan("tiny"));

app.use('/api/v1/users', userRoutes)

app.get("/bananas", async (_req: Request, res: Response) => {
    res.json({
        message: "hello this is bananas",
    });
});


