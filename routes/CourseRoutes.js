import express from "express";
import {
  addCourse,
  getCourses,
  deleteCourse,
  updateCourse,
  getSingleCourse,
  getCoursesByUser,
  purchase,
  getOrderByUser
} from "../controllers/CourseController.js";

import adminMiddleware from "../middlewares/admin-verification.js";
import userMiddleware from "../middlewares/user-verification.js";
import updateVerification from "../middlewares/update-verification.js";

const route = express.Router();

//Course CRUD Routes
route.post("/create-course",userMiddleware, adminMiddleware, addCourse);
route.get("/get-courses", userMiddleware, adminMiddleware,getCourses);
route.delete("/delete-course/:id",userMiddleware, adminMiddleware, deleteCourse);
route.put("/update-course/:id",userMiddleware, adminMiddleware, updateVerification, updateCourse);
route.get("/get-single-course/:id",userMiddleware, adminMiddleware, getSingleCourse);
route.get("/get-courses-by-user/:id",userMiddleware, adminMiddleware, getCoursesByUser);
route.post("/purchase", purchase);
route.get("/get-orders-by-user/:id",userMiddleware, adminMiddleware, getOrderByUser);
export default route;
