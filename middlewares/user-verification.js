import UserModel from "../models/UserModel.js";
import jwt from "jsonwebtoken";


const userMiddleware = async(req, res, next) => {
    const token = req.header("Authorization");

    if(!token){
        return res.status(401).json({message: "Unauthorized user..."});
    }

   // const jwtToken = token.replace("Bearer ", "").trim();

    
    try {
        console.log("JWT TOKEN ... ", token);

        const isVerified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = isVerified;
        const user = await UserModel.findOne({email: isVerified.email});
        //localStorage.setItem("user", isVerified);
        //console.log("Is VERIFIED USER", user);
        next();
        
        }
        
        //next();
        //return res.status(401).json({message: "Unauthorized user..."});
     catch (error) {
        return res.status(403).json({message: "You are not authorized for this operation"});
    }
};

export default userMiddleware;