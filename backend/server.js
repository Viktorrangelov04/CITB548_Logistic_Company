import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI).then(()=>console.log("Connected to MongoDB Atlas")).catch((err)=>console.log("connection error", err));

app.get("/", (req, res)=>{res.send("app is running");});

const PORT = process.env.PORT || 3000;
