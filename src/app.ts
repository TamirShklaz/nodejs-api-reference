import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import v1TodoRoutes from "./api/v1/todo.routes";
import v2TodoRoutes from "./api/v2/todo.routes";

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

app.use("/api/v1/todos", v1TodoRoutes);
app.use("/api/v2/todos", v2TodoRoutes);

export default app;
