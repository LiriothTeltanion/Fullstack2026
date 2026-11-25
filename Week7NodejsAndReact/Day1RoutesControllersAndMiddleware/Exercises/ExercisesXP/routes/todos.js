// Exercise 2: the todo routes only map URLs to controller functions.
import { Router } from "express";
import { getTodos, addTodo, updateTodo, deleteTodo } from "../controllers/todosController.js";

const router = Router();

router.get("/", getTodos);
router.post("/", addTodo);
router.put("/:id", updateTodo);
router.delete("/:id", deleteTodo);

export default router;
