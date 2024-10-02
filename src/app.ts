import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import authRoutes from "@/api/v1/auth/auth.routes";
import todoRoutes from "@/api/v1/todo/todo.routes";
import todoListRoutes from "@/api/v1/todo-list/todo-list.router";

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

// app.use("/api/v1/todos", v1TodoRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/todo", todoRoutes);
app.use("/api/v1/todo-list", todoListRoutes);

export default app;
