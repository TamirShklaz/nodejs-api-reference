import { Router } from "express";
import { createTodo, deleteAllTodos, deleteTodo, getTodo, getTodos, updateTodo } from "./todo.controller";
import { validateBody } from "../../../middleware/validate-body.middleware";
import { createTodoSchema } from "../../../schemas/create-todo.schema";
import { errorHandler } from "../../../middleware/error-handler.middleware";
import { validateQuery } from "../../../middleware/validate-query.middleware";
import { getTodosQueryParamsSchema } from "../../../schemas/get-todos-query-params.schema";
import { tryCatch } from "../../../utils/try-catch";
import { auth } from "../../../middleware/auth.middleware";

const router = Router();

router.get("/", validateQuery(getTodosQueryParamsSchema), getTodos);
router.get("/:id", getTodo);
router.post("/", auth, validateBody(createTodoSchema), tryCatch(createTodo));
router.patch("/:id", updateTodo);
router.delete("/", deleteAllTodos);
router.delete("/:id", deleteTodo);

router.use(errorHandler);

export default router;
