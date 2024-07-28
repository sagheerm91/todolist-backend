import jwt from "jsonwebtoken";
const adminMiddleware = async(req, res, next) => {

    try {
        const isAdmin = req.user.isAdmin;
        const isUser = req.user;
        if(isAdmin){
            next();
        } else if(isUser){
            next();
        }
        
        else{
            return res.status(403).json({message: "You are not authorized for this operation"});

        }
    } catch (error) {
        return res.status(401).json({message: error});

    }
//     const token = req.header("Authorization");

//     if(!token){
//         return res.status(401).json({message: "Unauthorized user..."});
//     }

//    // const jwtToken = token.replace("Bearer ", "").trim();

//     console.log("JWT TOKEN ... ", token);
//     try {
//         const isVerified = jwt.verify(token, process.env.JWT_SECRET);

//         //localStorage.setItem("user", isVerified);

//         const isVerifiedAdmin = isVerified.isAdmin;
        
//         console.log("Is VERIFIED ADMIN", isVerifiedAdmin);
        
//         if(isVerifiedAdmin){
//             req.isAdmin = isVerifiedAdmin;
//             next();
//         }
//         else{
//             return res.status(403).json({message: "You are not authorized for this operation"});
//         }
//         //next();
//         //return res.status(401).json({message: "Unauthorized user..."});
//     } catch (error) {
//         return res.status(401).json({message: error});
//     }
};

export default adminMiddleware;