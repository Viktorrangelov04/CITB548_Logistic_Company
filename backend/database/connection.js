import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const connectDB = async (uri = process.env.MONGO_URI) => {
  try {
    await mongoose.connect(uri);
    console.log("Database connected successfully");
  } catch (err) {
    console.error("Connection failed:", err.message);
    process.exit(1);
  }
};

export const disconnectDB = async () => {
  try {
    await mongoose.connection.close();
    console.log("Database disconnected");
  } catch (err) {
    console.error("Error closing DB connection:", err.message);
  }
};

export default mongoose; 