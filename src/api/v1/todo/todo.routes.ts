import { Router } from "express";
import { todoSchema } from "@/schemas/todo.schema";
import { createTodo, deleteAllTodos, deleteTodo, getTodo, updateTodo } from "@/api/v1/todo/todo.controller";
import { auth } from "@/middleware/auth.middleware";
import { validateBody } from "@/middleware/validate-body.middleware";
import { tryCatch } from "@/utils/try-catch";
import { errorHandler } from "@/middleware/error-handler.middleware";

const router = Router();

// router.get("/", validateQuery(getTodosQueryParamsSchema), getTodos);
router.get("/:id", getTodo);
router.post("/", auth, validateBody(todoSchema), tryCatch(createTodo));
router.patch("/:id", updateTodo);
router.delete("/", deleteAllTodos);
router.delete("/:id", deleteTodo);

router.use(errorHandler);

export default router;
