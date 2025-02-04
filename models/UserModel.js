import { mongoose } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = mongoose.Schema({
  username: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
  },
  phone: {
    type: String,
    require: false,
  },
  name:{
    type: String,
    require: true
  },
  password: {
    type: String,
    require: function() {
      return this.userType !== 'Google' && this.userType !== 'Facebook';
    },
  },
  image: {
    type: String,
    require: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  userType: {
    type: String,
    default: "Email",
  },
});

userSchema.pre("save", async function (next) {
  const user = this;

  if (user.userType === 'Google' || user.userType === 'Facebook' || !user.isModified("password")) {
    next();
  }
else{
  try {
    const saltRound = await bcrypt.genSalt(10);
    const hash_pass = await bcrypt.hash(user.password, saltRound);
    user.password = hash_pass;
  } catch (error) {
    next(error);
  }
}
  
});

// for comparing passwords
userSchema.methods.comparePassword = async function({password}) {
   // console.log("Log In Console ",this)
    return bcrypt.compare(password, this.password);
}

// for generating token
userSchema.methods.generateToken = async function () {
  try {
    const token = jwt.sign(
      {
        userId: this._id.toString(),
        email: this.email,
        isAdmin: this.isAdmin,
        userType: this.userType,
      },
      process.env.JWT_SECRET, {
        expiresIn: "1h"
      }
    );
    return token;
    
  } catch (error) {
    console.error(error);
  }
};

userSchema.methods.storeUserInfo = async function(token){
  const userInfo = jwt.verify(token, process.env.JWT_SECRET);
  return userInfo;
}

export default mongoose.model("User", userSchema);
