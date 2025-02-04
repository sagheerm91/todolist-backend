import User from "../models/UserModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

class UserService {
  async registerUser({ user }) {
    const { username, email, phone, password, name, image } = user;
    const userExist = await User.findOne({ email });
    if (userExist) {
      return { error: "User with the same email already exists" };
    }

    const createdUser = await User.create({
      username,
      email,
      phone,
      password,
      name,
      image,
    });
    const userInfo = createdUser.toObject();
      delete userInfo.password;
    return {
      message: "User created successfully",
      data: { email: createdUser.email },
      token: await createdUser.generateToken(),
      user: userInfo,
    };
  }

  // Login
  async login({ username, password }) {
    const userExist = await User.findOne({ username});

    if (!userExist) {
      return { error: "User does not exist" };
    }

    const isCompared = await userExist.comparePassword({ password });

    if (isCompared) {
      const token = await userExist.generateToken();
      userExist.image = `http://localhost:8000${userExist.image}`;

      const userInfo = userExist.toObject();
      delete userInfo.password;

      return {
        message: "Login successful",
        token: token,
        user: userInfo,
      };
    }
  }

  googleLogin = async ({ googleToken }) => {
    const decodedData = jwt.decode(googleToken);
    const { email, name, picture } = decodedData;

    const userExist = await User.findOne({ email, userType: "Google" }).select('-password');

    if (!userExist) {
      const createdUser = await User.create({
        username: email,
        email,
        phone: "",
        password: "",
        name,
        image: picture,
        userType: "Google",
      });
      const userInfo = createdUser.toObject();
      delete userInfo.password;
      return {
        message: "User created successfully",
        token: await createdUser.generateToken(),
        user: userInfo,
      };
    }

    return {
      message: "Login successful",
      token: await userExist.generateToken(),
      user: userExist,
    };
  };

  facebookLogin = async ({ fbData }) => {
    const { email, name, picture } = fbData;

    const userExist = await User.findOne({ email, userType: "Facebook" }).select('-password');

    if (!userExist) {
      const createdUser = await User.create({
        username: email,
        email,
        phone: "",
        password: "",
        name,
        image: picture.data.url,
        userType: "Facebook",
      });
      const userInfo = createdUser.toObject();
      delete userInfo.password;
      return {
        message: "User created successfully",
        token: await createdUser.generateToken(),
        user: userInfo,
      };
    }

    return {
      message: "Login successful",
      token: await userExist.generateToken(),
      user: userExist,
    };
  };

  // update user
  updateUser = async ({ id, username, email, phone, name, image }) => {
    try {
      const userExist = await User.findById({ _id: id }).select('-password');

      //console.log("User Exit Check...", userExist);

      if (!userExist) {
        return { error: "User not found" };
      }

      userExist.username = username || userExist.username;
      userExist.email = email || userExist.email;
      userExist.phone = phone || userExist.phone;
      userExist.name = name || userExist.name;
      userExist.image = image || userExist.image;

      await userExist.save();

      if(userExist.userType === "Google" || userExist.userType === "Facebook"){
        return {
          message: "User updated successfully",
          user: userExist,
        };
      }
      else{
        return {
          message: "User updated successfully",
          user: {
            _id: userExist._id,
            username: userExist.username,
            email: userExist.email,
            phone: userExist.phone,
            name: userExist.name,
            image: `http://localhost:8000${userExist.image}`,
          },
        };
      }

    } catch (error) {
      return { error: "Server error" };
    }
  };

  // async updateUser({id, user}) {
  //   const fs = require("fs");
  //   const path = require("path");
  //   const { v4: uuidv4 } = require("uuid");

  //   const { username, email, phone, name, image } = user;

  //   try {
  //     const userExist = await User.findById(id);

  //     // If the user doesn't exist, return an error
  //     if (!userExist) {
  //         return { error: "User not found" };
  //     }

  //     // If there is a new image, decode and save it
  //     let imagePath;
  //     if (image) {
  //       const base64Data = image.split(",")[1];
  //       const imageBuffer = Buffer.from(base64Data, "base64");
  //       const imageName = `${uuidv4()}.png`; // or any other extension
  //       imagePath = path.join(__dirname, "uploads", imageName);
  //       fs.writeFileSync(imagePath, imageBuffer);
  //       imagePath = `/uploads/${imageName}`; // Assuming /uploads is served statically
  //     }

  //     // Update the user's record
  //     const updatedUser = await User.findByIdAndUpdate(
  //       id,
  //       { username, email, phone, name, image: imagePath || user.image },
  //       { new: true }
  //     );

  //     res.json({
  //       message: "User updated successfully",
  //       user: updatedUser,
  //     });
  //   } catch (error) {
  //     res.status(500).json({ error: error.message });
  //   }
  // }
}

export default new UserService();
