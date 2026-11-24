import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, minlength: 2, maxlength: 80 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  role: { type: String, enum: ["User", "Manager", "Admin"], default: "User" },
  status: { type: String, enum: ["Active", "Inactive"], default: "Active" }
}, { timestamps: true });

export default mongoose.model("User", userSchema);
