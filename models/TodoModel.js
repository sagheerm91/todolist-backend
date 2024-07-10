import mongoose from "mongoose";

const todoSchema = mongoose.Schema({
    task:{
        type:String,
        required: true
    }
});

export default mongoose.model("todos", todoSchema);