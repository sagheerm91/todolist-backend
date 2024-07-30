import mongoose from "mongoose";

const paymentSchema = mongoose.Schema({
  userId: { type: String, required: true },
  courseIds: { type: [String], required: true },
  price: { type: Number, required: true },
  paymentId: { type: String, required: true },
});
export default mongoose.model("payment", paymentSchema);
