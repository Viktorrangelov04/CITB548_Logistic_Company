import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import  rateLimit from "express-rate-limit"
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use("/users", userRoutes);
app.use("/orders", orderRoutes);

const limiter = rateLimit({
  windowMs: 15*60*1000,
  limit: 100,
  standardheaders: 'draft-8',
  legacyHeaders: false,
  ipv6subnet:56,
})
app.use(limiter);

try {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("MongoDB Connected Successfully!");
} catch (error) {
  console.error("MongoDB Connection Failed:", error.message);
  process.exit(1); 
}

//app.get("/", (req, res)=>{res.send("app is running");});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on port 3000"));
