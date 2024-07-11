import express from "express";
import { createTodo, getTodos, updateTodo, deleteTodo } from "../controllers/TodoController.js";

const route = express.Router();

//Todo CRUD Routes
route.post("/create-todo", createTodo);
route.get("/get-todos", getTodos);
route.put("/update-todo/:id", updateTodo);
route.delete("/delete-todo/:id", deleteTodo);
//route.get("/update-single-todo/:id", getSingleTodo);


export default route;