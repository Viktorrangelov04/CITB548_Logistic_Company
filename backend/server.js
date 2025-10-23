import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import bcrypt from "bcrypt";
import User from "./models/userModel.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const users = [];

app.get('/users', async (req, res)=>{
  try{
    const users = await User.find();
    res.status(200).json(users);
  }catch(error){
    console.error("Error fetching users:", error);
    res.status(500).json({message: "Failed to get users"})
  }
   
})

app.post('/users', async (req, res)=>{
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    const newUser = new User({ name: req.body.name, email: req.body.email, password: hashedPassword})
    try{
        const savedUser = await newUser.save();
        console.log("User saved to MongoDB:", savedUser);
        res.status(201).json({ message: "User created successfully", user: savedUser });
    }catch{
        console.error("Error saving user:", error);
        res.status(500).json({ error: "Failed to save user" });
    }
})

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
