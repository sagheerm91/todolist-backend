import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const courseSchema = mongoose.Schema({
    title:{
        type:String,
        required: true
    },
    description:{
        type:String,
        required: true
    },
    originalPrice:{
        type:Number,
        required: true
    },
    discountedPrice:{
        type:Number,
        required: true
    },
    image:{
        type:String,
        required: true
    },
    createdBy:{
        type: String
    }
});

courseSchema.plugin(mongoosePaginate);

export default mongoose.model("courses", courseSchema);