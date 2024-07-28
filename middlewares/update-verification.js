import UserModel from "../models/UserModel.js";
import multer from 'multer';

const upload = multer();

 
const UpdateVerification = async(req, res, next) => {
    const userId = req.header("UserId");
    const userIdFromCourse = req.header("userIdFromCourse");
    // console.log('====================================');
    // console.log("COURSE JSON --- ", userIdFromCourse);
    // console.log('====================================');
    try {
        // console.log('====================================');
        // console.log("User Id In Header --- ", userId);
        // console.log('====================================');

        if(userIdFromCourse === userId){
            next();
        }
        else{
            return res.status(400).json({message: "This is not your record to update"});
        }
    } catch (error) {
        return res.status(403).json({message: "You are not authorized for this operation"});
    }
}
export default UpdateVerification;