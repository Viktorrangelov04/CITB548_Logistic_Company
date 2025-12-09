import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import companyRoutes from "./routes/companyRoutes.js";
import officeRoutes from "./routes/officeRoutes.js";
const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,                 
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

const corsOptions = {
  origin: "http://localhost:5500", 
  credentials: true, 
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/users", userRoutes);
app.use("/orders", orderRoutes);
app.use("/auth", authRoutes);
app.use("/company", companyRoutes);
app.use("/office", officeRoutes);
export default app;