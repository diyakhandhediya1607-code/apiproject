import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 120 },
  description: { type: String, default: "", maxlength: 1000 },
  price: { type: Number, required: true, min: 0 },
  category: { type: String, required: true, trim: true, maxlength: 80 },
  stock: { type: Number, default: 0, min: 0, validate: { validator: Number.isInteger, message: "Stock must be a whole number." } },
  status: { type: String, enum: ["Active", "Inactive"], default: "Active" }
}, { timestamps: true });

export default mongoose.model("Product", productSchema);
