import { Request, Response } from "express";
import { db } from "../../../db/drizzle";
import { todos } from "../../../db/schema";
import { eq } from "drizzle-orm";

const formatTodo = (todo: typeof todos.$inferSelect, req: Request) => {
  return { ...todo, url: `${req.protocol}://${req.get("host")}${req.baseUrl}/${todo.id}` };
};

export const getTodos = async (req: Request, res: Response) => {
  const todos = await db.query.todos.findMany();
  const formatedTodos = todos.map((todo) => formatTodo(todo, req));
  res.status(200).send(formatedTodos);
};

export const createTodo = async (req: Request, res: Response) => {
  const { title, order, completed } = req.body;
  console.log(req.body);
  const sqlRes = await db.insert(todos).values({ title, order, completed }).returning();
  const newTodo = sqlRes[0];
  res.status(201).send(formatTodo(newTodo, req));
};

export const getTodo = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const todo = await db.query.todos.findFirst({ where: eq(todos.id, id) });
  if (!todo) {
    return res.status(404).send(`Todo with ID ${id} not found`);
  }
  return res.status(200).send(formatTodo(todo, req));
};

export const deleteTodo = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  await db.delete(todos).where(eq(todos.id, id));
  return res.status(204).send("DELETED TODO");
};

export const deleteAllTodos = async (req: Request, res: Response) => {
  await db.delete(todos);
  res.status(204).send("DELETED ALL TODOS");
};

export const updateTodo = async (req: Request, res: Response) => {
  const { title, completed, order } = req.body;
  const id = parseInt(req.params.id);
  const updatedTodoRes = await db.update(todos).set({ title, order, completed }).where(eq(todos.id, id)).returning();
  res.status(200).send(formatTodo(updatedTodoRes[0], req));
};
