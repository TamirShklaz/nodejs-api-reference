import { Router } from "express";
import { auth, AuthenticatedRequest } from "@/middleware/auth.middleware";
import { tryCatch } from "@/utils/try-catch";
import { createTodoList, getList, shareTodoList } from "@/api/v1/todo-list/todo-list.controller";
import { shareTodoListSchema } from "@/schemas/todo-list.schema";
import { validateBody } from "@/middleware/validate-body.middleware";
import { validateQuery } from "@/middleware/validate-query.middleware";
import { getTodosQueryParamsSchema } from "@/schemas/todo.schema";

const router = Router();

router.post("/", auth, tryCatch<AuthenticatedRequest>(createTodoList));
router.post("/:id/share", auth, validateBody(shareTodoListSchema), tryCatch<AuthenticatedRequest>(shareTodoList));
router.get("/:id", auth, validateQuery(getTodosQueryParamsSchema), tryCatch<AuthenticatedRequest>(getList));

export default router;
