import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { createTodo, deleteTodo, editTodo, getAllTodos,getOneTodo,getBoardTodos  } from "../controllers/todo.controller.js";

const todoRoutes = express.Router();

todoRoutes.post("/create", protectRoute, createTodo);
todoRoutes.get("/get/:todoId", protectRoute, getOneTodo);
todoRoutes.get("/list/getAll", protectRoute, getAllTodos);
todoRoutes.get("/board/getAll", protectRoute, getBoardTodos);
todoRoutes.delete("/:todoId", protectRoute, deleteTodo);
todoRoutes.post("/edit/:todoId", protectRoute, editTodo);

export default todoRoutes;