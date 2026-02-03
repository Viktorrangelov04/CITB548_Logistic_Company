import mongoose from "mongoose";
import { Schema, model } from "mongoose";

const orderSchema = new Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  employee: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  office: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Office",
    required: function () {
      return this.type === "office";
    },
  },
  address: {
    type: String,
    required: function () {
      return this.type === "address";
    },
  },
  weight: { type: String },
  status: {
    type: String,
    enum: ["processing", "shipping", "delivered", "received"],
    default: "processing",
    lowercase: true,
  },
  type: {
    type: String,
    enum: ["office", "address"],
    lowercase: true,
    required: [true, "Please enter order type"],
  },
  price: { type: mongoose.Schema.Types.Decimal128 },
});

const Order = model("Order", orderSchema);
export default Order;
