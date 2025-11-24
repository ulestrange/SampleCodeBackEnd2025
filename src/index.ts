import express, { Application, Request, Response } from "express";
import morgan from "morgan";
import userRoutes from './routes/users';
import authRoutes from './routes/auth';


import { initDb } from './database';
import cors from 'cors';
import { authenticateKey } from "./middleware/auth.middleware";



export const app: Application = express();

initDb()

const corsOptions = {
  origin: ["http://localhost:4200", "http://localhost:3000", "https://localhost:4200"],
  credentials: true,
};

app.use(cors<Request>(corsOptions));

app.use(express.json());


app.get("/ping", async (_req: Request, res: Response) => {
    res.json({
        message: "hello from Una",
    });
});


//app.use(authenticateKey);
app.use(morgan("tiny"));

app.use('/api/v1/users', userRoutes)
app.use('/api/v1/auth', authRoutes)

app.get("/bananas", async (_req: Request, res: Response) => {
    res.json({
        message: "hello this is bananas",
    });
});


