import { Router } from "express";
import { createTodo, deleteAllTodos, deleteTodo, getTodo, getTodos, updateTodo } from "./todo.controller";

const router = Router();

router.get("/", getTodos);
router.get("/:id", getTodo);
router.post("/", createTodo);
router.patch("/:id", updateTodo);
router.delete("/", deleteAllTodos);
router.delete("/:id", deleteTodo);

export default router;
