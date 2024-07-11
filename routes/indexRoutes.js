import express from "express";
import TodoRoute from "./TodoRoutes.js"
import UserRoutes from "./UserRoutes.js"

const route = express.Router();
route.use("/todos", TodoRoute);
route.use("/users", UserRoutes);

export default route;