import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import { number } from "zod";
import { OrderStatus } from "../enums/OrderStatus.js";

const orderSchema = mongoose.Schema({
    createdBy:{
        type:String,
        require:true
    },
    courseId:{
        type:String,
        require:true
    },
    courseTitle:{
        type:String
    },
    price:{
        type: Number
    }
    ,
    orderStatus:{
        type: String,
        default: OrderStatus.PENDING
    },
    createdAt:{
        type: Date,
        default: Date.now
    }
});

//orderSchema.plugin(mongoosePaginate);

export default mongoose.model("order", orderSchema);