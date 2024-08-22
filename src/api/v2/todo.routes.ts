import { Router } from "express";
import { createTodo, deleteAllTodos, deleteTodo, getTodo, getTodos, updateTodo } from "./todo.controller";
import { validateBody } from "../../middleware/validate-body.middleware";
import { createTodoSchema } from "../../schemas/create-todo.schema";
import { errorHandler } from "../../middleware/error-handler.middleware";
import { validateQuery } from "../../middleware/validate-query.middleware";
import { getTodosQueryParamsSchema } from "../../schemas/get-todos-query-params.schema";

const router = Router();

router.get("/", validateQuery(getTodosQueryParamsSchema), getTodos);
router.get("/:id", getTodo);
router.post("/", validateBody(createTodoSchema), createTodo);
router.patch("/:id", updateTodo);
router.delete("/", deleteAllTodos);
router.delete("/:id", deleteTodo);

router.use(errorHandler);

export default router;
