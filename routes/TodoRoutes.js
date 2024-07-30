import express from "express";
import { createTodo, getTodos, updateTodo, deleteTodo } from "../controllers/TodoController.js";
import adminMiddleware from "../middlewares/admin-verification.js";
import userMiddleware from "../middlewares/user-verification.js";
import validate from "../middlewares/validator.js";
import todoSchema from "../validators/todo-validation.js";


const route = express.Router();

//Todo CRUD Routes
route.post("/create-todo", userMiddleware, adminMiddleware, validate(todoSchema), createTodo);
route.get("/get-todos", userMiddleware, adminMiddleware, getTodos);
route.put("/update-todo/:id", userMiddleware, adminMiddleware, validate(todoSchema), updateTodo);
route.delete("/delete-todo/:id", userMiddleware, adminMiddleware, deleteTodo);
//route.get("/update-single-todo/:id", getSingleTodo);


export default route;