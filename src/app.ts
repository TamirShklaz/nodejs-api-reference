import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();

app.use(bodyParser.json());
app.use(
  cors({
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.get("/healthcheck", async (req: Request, res: Response) => {
  res.status(200).send("OK");
});

export default app;
