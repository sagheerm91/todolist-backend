import express from "express";
import { register, login } from "../controllers/UserController.js";

const route = express.Router();

route.post("/register-user", register);
route.post("/login", login);

export default route;