import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/userModel.js";
import express from "express"

const router = express.Router();

router.get("/:id", async(req, res)=>{
    const { id } = req.params;
    if(!id){
        res.status(400),json({message:"Missing user ID"})
    }
    try{
        const user = await User.findByID(id);
        if(!user){
            return res.status(404).json({message:"User not found"})
        }
        res.status(200).json(user);
    }catch{
        res.status(500).json({message:"Server error"})
    }
})//Find users by ID

router.get("/", async (req, res) =>{
    const {role} = req.query;
    if(!role){
        return res.status(400).json({message:"Missing user role"})
    }
    try{
        
        const users = role ? await User.find({ role }) : await User.find();

        res.status(200).json(users);
    }catch(error){
        res.status(500).json({message:"Failed to get users"})
    }
});//Find users by role

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
});//Logging in

router.post("/register", async(req, res)=>{
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = new User({name: req.body.name, email: req.body.email, password: hashedPassword });
    try{
        const savedUser = newUser.save();
        console.log("new user saved to db", savedUser);
        res.status(201).json({message:"user created successfully", user: savedUser});
    }catch{
        console.error("failed to save user", error.message);
        res.status(500).json({message: "failed to save the user"})
    }
})//creating account

router.put("/:id", async(req, res)=>{
    const { id } = req.params;
    const { role } = req.body;
    if(!id || !role){
        return res.status(400).json({message:"Missing id or new role"})
    }
    try{
        const result = await db.collection("user").updateOne(
            {_id: new ObjectId(id)},
            {$set:{"role":role}}
        )
        if(result.matchedCount === 0){
            return res.status(404).json({message: "User not found"})
        }
        res.status(200).json({message: "Role updated successfully"})
    }catch{
        res.status(500).json({message:"Server error"})
    }
})//editting user role

router.delete("/:id", async(req, res)=>{
    const { id } = req.params;
    if(!id){
        return res.status(400).json({message:"Missing user ID"})
    }
    try{
        const result = await db.collection("user").deleteOne({
            _id: new ObjectId(id)
        })
        if(result.deletedCount === 0){
            return res.status(404).json("User not found")
        }
        res.status(200).json({message:"user deleted successfully"})
    }catch{
        res.status(500).json({message: "Server error"})
    }
})//Deleting order by ID
export default router;