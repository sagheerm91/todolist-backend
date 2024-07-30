import express from "express";
import { register, login, update } from "../controllers/UserController.js";
import signupSchema from "../validators/signup-validation.js";
import validate from "../middlewares/validator.js";
import loginSchema from "../validators/login-validation.js";


const route = express.Router();

route.post("/register-user", validate(signupSchema) ,register);
route.post("/login", validate(loginSchema) , login);
route.put("/update-user/:id", update);

export default route;