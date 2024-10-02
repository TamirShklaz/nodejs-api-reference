import { Request, Response } from "express";

import { eq } from "drizzle-orm";

import { todoList, todos } from "@/db/schema";
import { db } from "@/db/drizzle";
import { decodeCursor } from "@/utils/cursor";
import { cursorSchema } from "@/schemas/cursor.schema";
import { tryCatch } from "@/utils/try-catch";
import { AuthenticatedRequest } from "@/middleware/auth.middleware";
import { CreateTodoSchema } from "@/schemas/todo.schema";
import { NotFoundError } from "@/errors/not-found.error";
import { StatusCodes } from "http-status-codes";
import { AuthError } from "@/errors/auth.error";

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

export const createTodo = async (req: AuthenticatedRequest<unknown, unknown, CreateTodoSchema>, res: Response) => {
  const { title, description, status, priority, todoListId } = req.body;
  // const token = req.token;
  // const token = req.token;
  const userId = req.userId!;

  if (todoListId) {
    const list = await db.query.todoList.findFirst({ where: eq(todoList.id, todoListId) });
    if (!list) {
      throw new NotFoundError(`TodoList with ID ${todoListId} not found`);
    }
    if (list.userId !== userId) {
      throw new AuthError(`TodoList with ID ${todoListId} not found`);
    }
  }

  const [todo] = await db
    .insert(todos)
    .values({
      title,
      description,
      status,
      priority,
      todoListId,
      userId,
    })
    .returning();
  res.status(StatusCodes.CREATED).send(formatTodo(todo, req));
};

export const getTodo = tryCatch(async (req: Request, res: Response) => {
  const id = req.params.id;
  const todo = await db.query.todos.findFirst({ where: eq(todos.id, id) });
  if (!todo) {
    throw new NotFoundError(`Todo with ID ${id} not found`);
  }
  return res.status(200).send(formatTodo(todo, req));
});

export const deleteTodo = tryCatch(async (req: Request, res: Response) => {
  const id = req.params.id;
  await db.delete(todos).where(eq(todos.id, id));
  return res.status(204).send("DELETED TODO");
});

export const deleteAllTodos = tryCatch(async (req: Request, res: Response) => {
  await db.delete(todos);
  res.status(204).send("DELETED ALL TODOS");
});

export const updateTodo = tryCatch(async (req: Request, res: Response) => {
  const { title } = req.body;
  const id = req.params.id;
  const updatedTodoRes = await db.update(todos).set({ title }).where(eq(todos.id, id)).returning();
  res.status(200).send(formatTodo(updatedTodoRes[0], req));
});
