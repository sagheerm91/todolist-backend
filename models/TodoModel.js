import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const todoSchema = mongoose.Schema({
    task:{
        type:String,
        required: true
    }
});
todoSchema.plugin(mongoosePaginate);
export default mongoose.model("todos", todoSchema);