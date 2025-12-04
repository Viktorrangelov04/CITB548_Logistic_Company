import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";

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

app.use(cors());
app.use(express.json());
app.use("/users", userRoutes);
app.use("/orders", orderRoutes);
app.use("/auth", authRoutes);
app.use("/company", companyRoutes);
app.use("/office", officeRoutes);
export default app;