import { Request, Response } from "express";
import { db } from "../../../../db/drizzle";
import { todos } from "../../../../db/schema";
import { asc, eq, gt } from "drizzle-orm";
import { tryCatch } from "../../../utils/try-catch";
import { NotFoundError } from "../../../errors/not-found.error";
import { CreateTodoSchema } from "../../../schemas/create-todo.schema";
import { GetTodosQueryParams } from "../../../schemas/get-todos-query-params.schema";
import { cursorSchema } from "../../../schemas/cursor.schema";
import { decodeCursor, encodeCursor } from "../../../utils/cursor";
import { AuthenticatedRequest } from "../../../middleware/auth.middleware";

const formatTodo = (todo: typeof todos.$inferSelect, req: Request<any, any, any, any>) => {
  return { ...todo, url: `${req.protocol}://${req.get("host")}${req.baseUrl}/${todo.id}` };
};

// order_by
// search
// filtering
// cursor based
// page base

export const getCursor = (cursor: string) => {
  const decodedCursor = cursor ? decodeCursor(cursor) : undefined;
  console.log("DECODED CURSOR", decodedCursor);
  const { data, error } = cursorSchema.safeParse(decodedCursor);
  if (error) {
    console.warn("Invalid cursor", error);
  }
  return data?.id;
};

export const getTodos = tryCatch(async (req: Request<any, any, any, GetTodosQueryParams>, res: Response) => {
  const { cursor, limit } = req.query;
  console.log("CURSOR", cursor);

  const cursorId = cursor ? getCursor(cursor) : undefined;
  const where = cursorId ? gt(todos.id, cursorId) : undefined;

  const results = await db.query.todos.findMany({ orderBy: [asc(todos.id)], where, limit: limit });
  const formatedTodos = results.map((todo) => formatTodo(todo, req));

  const lastId = results[results.length - 1]?.id;
  const encodedCursor = encodeCursor({ id: lastId });

  const next =
    results.length === limit
      ? `${req.protocol}://${req.get("host")}${req.baseUrl}?cursor=${encodedCursor}&limit=${limit}`
      : undefined;

  const response = {
    todos: formatedTodos,
    numTodos: formatedTodos.length,
    next,
    nextCursor: encodedCursor,
    limit,
  };
  res.status(200).send(response);
});

export const createTodo = async (req: AuthenticatedRequest<unknown, unknown, CreateTodoSchema>, res: Response) => {
  const { title, order, completed } = req.body;
  // const token = req.token;

  const sqlRes = await db.insert(todos).values({ title, order, completed }).returning();
  const newTodo = sqlRes[0];
  res.status(201).send(formatTodo(newTodo, req));
};

export const getTodo = tryCatch(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const todo = await db.query.todos.findFirst({ where: eq(todos.id, id) });
  if (!todo) {
    throw new NotFoundError(`Todo with ID ${id} not found`);
  }
  return res.status(200).send(formatTodo(todo, req));
});

export const deleteTodo = tryCatch(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  await db.delete(todos).where(eq(todos.id, id));
  return res.status(204).send("DELETED TODO");
});

export const deleteAllTodos = tryCatch(async (req: Request, res: Response) => {
  await db.delete(todos);
  res.status(204).send("DELETED ALL TODOS");
});

export const updateTodo = tryCatch(async (req: Request, res: Response) => {
  const { title, completed, order } = req.body;
  const id = parseInt(req.params.id);
  const updatedTodoRes = await db.update(todos).set({ title, order, completed }).where(eq(todos.id, id)).returning();
  res.status(200).send(formatTodo(updatedTodoRes[0], req));
});
