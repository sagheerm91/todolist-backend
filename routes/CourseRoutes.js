import express from "express";
import bodyParser from "body-parser";
import {
  addCourse,
  getCourses,
  deleteCourse,
  updateCourse,
  getSingleCourse,
  getCoursesByUser,
  // purchase,
  getOrderByUser,
  stripeWebhook,
  makePayment,
  savePayment, 
  cancelPayment
} from "../controllers/CourseController.js";

import adminMiddleware from "../middlewares/admin-verification.js";
import userMiddleware from "../middlewares/user-verification.js";
import updateVerification from "../middlewares/update-verification.js";
import validate from "../middlewares/validator.js";
import courseSchema from "../validators/course-validation.js";

const route = express.Router();

//Course CRUD Routes
route.post(
  "/create-course",
  userMiddleware,
  adminMiddleware,
 // validate(courseSchema),
  addCourse
);
route.get("/get-courses", userMiddleware, adminMiddleware, getCourses);
route.delete(
  "/delete-course/:id",
  userMiddleware,
  adminMiddleware,
  deleteCourse
);
route.put(
  "/update-course/:id",
  userMiddleware,
  adminMiddleware,
  updateVerification,
  //validate(courseSchema),
  updateCourse
);
route.get(
  "/get-single-course/:id",
  userMiddleware,
  adminMiddleware,
  getSingleCourse
);
route.get(
  "/get-courses-by-user/:id",
  userMiddleware,
  adminMiddleware,
  getCoursesByUser
);
//route.post("/purchase", purchase);
route.get(
  "/get-orders-by-user/:id",
  userMiddleware,
  adminMiddleware,
  getOrderByUser
);


route.post("/create-checkout-session", makePayment);
route.post("/save-payment-details", savePayment);
route.post("/canel-payment", cancelPayment);
route.post("/webhook", stripeWebhook);
export default route;
