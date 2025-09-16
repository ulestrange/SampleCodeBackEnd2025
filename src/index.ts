import express, {Application, Request, Response} from "express" ;
import morgan from "morgan";

const PORT = process.env.PORT || 7000;

const app: Application = express();



app.get("/ping", async (_req : Request, res: Response) => {
    res.json({
    message: "hello from Una - changed",
    });
});

app.use(morgan("tiny"));

app.get("/bananas", async (_req : Request, res: Response) => {
    res.json({
    message: "hello this is bananas",
    });
});

app.listen(PORT, () => {
    console.log("Server is running on port", PORT);
    });
