import { AuthenticatedRequest } from "@/middleware/auth.middleware";
import { CreateTodoListInput, ShareTodoListInput } from "@/schemas/todo-list.schema";
import { Response } from "express";
import { db } from "@/db/drizzle";
import { todoList, todoListPermission, todos } from "@/db/schema";
import { StatusCodes } from "http-status-codes";
import { and, asc, desc, eq, gt, or, SQL } from "drizzle-orm";
import { AuthError } from "@/errors/auth.error";
import { GetTodoQueryParams } from "@/schemas/todo.schema";
import { decodeCursor, encodeCursor } from "@/utils/cursor";

export const createTodoList = async (
  req: AuthenticatedRequest<unknown, unknown, CreateTodoListInput>,
  res: Response,
) => {
  const { title, description } = req.body;
  const userId = req.userId!;
  const [todoListResponse] = await db
    .insert(todoList)
    .values({
      title,
      description,
      userId,
    })
    .returning();
  res.status(StatusCodes.CREATED).json({ todoList: todoListResponse });
};

export const shareTodoList = async (
  req: AuthenticatedRequest<{ id: string }, unknown, ShareTodoListInput>,
  res: Response,
) => {
  const { userIds: idsToShare } = req.body;
  const userId = req.userId!;
  const todoListId = req.params.id;

  const ownedList = await db.query.todoList.findFirst({ where: eq(todoList.id, todoListId) });
  if (!ownedList) {
    throw new Error("Todo list not found");
  }
  if (userId !== ownedList.userId) {
    throw new AuthError("You are not authorized to share this todo list");
  }
  const successfullySharedWithUserIds = await Promise.all(
    idsToShare.map(async (id) => {
      const [insertRes] = await db
        .insert(todoListPermission)
        .values({
          userId: id,
          todoListId,
          permission: "edit",
        })
        .returning();
      return insertRes.userId;
    }),
  );
  return res.status(StatusCodes.CREATED).json({ ids: successfullySharedWithUserIds });
};

export const getList = async (
  req: AuthenticatedRequest<
    {
      id: string;
    },
    unknown,
    unknown,
    GetTodoQueryParams
  >,
  res: Response,
) => {
  const listId = req.params.id;
  const { cursor, order_by: orderBy, order, status, limit } = req.query;

  const cursorParams = cursor ? decodeCursor(cursor) : null;

  const whereConditions: any[] = [eq(todos.todoListId, listId)];
  if (status) {
    whereConditions.push(eq(todos.status, status));
  }

  if (cursorParams) {
    if (order === "asc") {
      const cursorFieldEqualsCurrent = eq(todos[cursorParams.field], cursorParams.value);
      const cursorFieldGreaterThanCurrent = gt(todos[cursorParams.field], cursorParams.value);
      const cursorIdGreaterThan = gt(todos.id, cursorParams.id);
      const com = and(cursorFieldEqualsCurrent, cursorIdGreaterThan);
      const orClause = or(cursorFieldGreaterThanCurrent, com);
      whereConditions.push(orClause);
    } else {
      const cursorFieldEqualsCurrent = eq(todos[cursorParams.field], cursorParams.value);
      const cursorFieldLessThanCurrent = gt(todos[cursorParams.field], cursorParams.value);
      const cursorIdLessThan = gt(todos.id, cursorParams.id);
      const com = and(cursorFieldEqualsCurrent, cursorIdLessThan);
      const orClause = or(cursorFieldLessThanCurrent, com);
      whereConditions.push(orClause);
    }
  }

  let orderByParams: SQL[] = [];
  if (orderBy) {
    orderByParams = order === "asc" ? [asc(todos[orderBy]), asc(todos.id)] : [desc(todos[orderBy]), desc(todos.id)];
  }
  const results = await db.query.todos.findMany({ where: and(...whereConditions), orderBy: orderByParams, limit });

  let nextCursor = null;
  if (results.length === limit) {
    const lastItem = results[results.length - 1];
    nextCursor = encodeCursor({ id: lastItem.id, field: orderBy || "id", value: lastItem[orderBy || "id"] });
  }

  return res.status(StatusCodes.OK).json({ todos: results, limit, nextCursor });
};
