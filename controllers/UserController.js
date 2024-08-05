import UserService from "../services/UserService.js";
import User from "../models/UserModel.js";
import jwt from "jsonwebtoken";
import upload from "../config/multerConfig.js"; // Import Multer configuration

export const register = async (req, res) => {
  try {
    const user = new User(req.body);
    const result = await UserService.registerUser({ user });
    if (result.error) {
      return res.status(409).json({ message: result.error }); // 409 Conflict
    }
    return res.status(201).json(result);
  } catch (error) {
    return res.status(500).json({ message: "Error registering user" });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const result = await UserService.login({ username, password });
    if (result.error) {
      return res.status(404).json({ message: result.error });
    }
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: "Error while signing in" });
  }
};

export const googleLogin = async (req, res) => {
  try {
    const { googleToken } = req.body;
    //console.log(" Google Token From Body ", googleToken);
    const result = await UserService.googleLogin({ googleToken });
    if (result.error) {
      return res.status(404).json({ message: result.error });
    }
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: "Error while signing in" });
  }
};

export const facebookLogin = async (req, res) => {
  try {
    const { fbData } = req.body;
    console.log(" FB Res From Body ", fbData);
    const result = await UserService.facebookLogin({ fbData });
    if (result.error) {
      return res.status(404).json({ message: result.error });
    }
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: "Error while signing in" });
  }
};

export const update = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    try {
      const image = req.file ? `/uploads/${req.file.filename}` : undefined;
      const id = req.params.id;
      const result = await UserService.updateUser({ id, ...req.body, image });

      if (result.error) {
        return res.status(409).json({ message: result.error }); // 409 Conflict
      }

      return res.status(200).json(result); // 200 OK
    } catch (error) {
      return res.status(500).json({ message: "Error updating user" });
    }
  });
};
