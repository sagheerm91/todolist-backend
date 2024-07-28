import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const orderSchema = mongoose.Schema({
    createdBy:{
        type:String,
        require:true
    },
    courseId:{
        type:String,
        require:true
    },
    createdAt:{
        type: Date,
        default: Date.now
    }
});

//orderSchema.plugin(mongoosePaginate);

export default mongoose.model("order", orderSchema);