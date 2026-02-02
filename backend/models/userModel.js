import mongoose from "mongoose";
import { Schema, model } from "mongoose";

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["client", "employee-office", "employee-courier"],
    default: "client",
    lowercase: true,
  },
  company: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
});

const User = model("User", userSchema);
export default User;
