import express from "express";
import { register, login, update } from "../controllers/UserController.js";

const route = express.Router();

route.post("/register-user", register);
route.post("/login", login);
route.put("/update-user/:id", update);

export default route;