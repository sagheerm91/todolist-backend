import express from "express";
import TodoRoute from "./TodoRoutes.js";
import UserRoutes from "./UserRoutes.js";
import CourseRoutes from "./CourseRoutes.js";

const route = express.Router();
route.use("/todos", TodoRoute);
route.use("/users", UserRoutes);
route.use("/courses", CourseRoutes);

export default route;