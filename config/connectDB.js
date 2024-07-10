import mongoose from "mongoose";


export const connectDatabase = async (MONGOURL) => {
    try {
        await mongoose.connect(MONGOURL);
        console.log("Database connected successfully");
    } catch (error) {
        console.log(error);
    }
};