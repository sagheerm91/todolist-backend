import User from "../models/UserModel.js";
import bcrypt from "bcryptjs";

class UserService {
  async registerUser({ user }) {
    const { username, email, phone, password } = user;
    const userExist = await User.findOne({ email });
    if (userExist) {
      return { error: "User with the same email already exists" };
    }

    const createdUser = await User.create({ username, email, phone, password });
    return {
      message: "User created successfully",
      data: { email: createdUser.email },
      token: await createdUser.generateToken(),
      user:createdUser
    };
  };


  // Login
  async login({username, password}){
    const userExist = await User.findOne({username});
    
    if(!userExist){
        return {error: "User does not exist"};
    }
    
    const isCompared = await userExist.comparePassword({password});

    if(isCompared){
      const token = await userExist.generateToken();
        return {
            message: "Login successful",
            token: token,
            userInfo: userExist
          };
    } 
  };
  
}

export default new UserService();
