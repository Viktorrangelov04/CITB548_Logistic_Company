import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/userModel.js";
import express from "express"


const router = express.Router();

router.get("/", async (req, res) =>{
    try{
        const users = await User.find();
        res.status(200).json(users);
    }catch(error){
        res.status(500).json({message:"Failed to get users"})
    }
});

router.post("/login", async (req, res)=>{
    try{
        const user = await User.findOne({email: req.body.email})
        if(!user) return res.status(401).json({message: "account with that email doesn't exist"})

        const isMatch = await bcrypt.compare(req.body.password, user.password);
        if(!isMatch) return res.status(401).json({message:"wrong password"})
        
        const token = jwt.sign(
            { id: user._id, email: user.email},
            process.env.JWT_SECRET,
            {expiresIn:"1h"}
        );
        console.log("token:", token);
        res.cookie("token", token, {
            httpOnly: true,
            //secure: true,
            sameSite: "Lax",
            maxAge:360000
        })

        res.status(200).json({message: "Login successful"});

    }catch(error){
        console.error("Login error:", error);
        res.status(500).json({message:"server error"});
    }
});

export default router;