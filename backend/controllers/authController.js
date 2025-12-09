import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/userModel.js";
import Company from "../models/companyModel.js";

const JWT_SECRET = process.env.JWT_SECRET;
const REFRESH_SECRET =process.env.REFRESH_SECRET 

const generateAccessToken =(entity, type) => {
  return jwt.sign(
    { id: entity._id, type: type }, 
    JWT_SECRET,
    { expiresIn: "15m" }
  );
};

const generateRefreshToken = (entity, type) => {
  return jwt.sign(
    { id: entity._id, type: type }, 
    REFRESH_SECRET,
    { expiresIn: "7d" }
  );
};

export const getMe = async (req, res) => {
  try {
    let entity;
    if (req.entity.type === "user") {
      entity = await User.findById(req.entity.id).select("-password"); 
    } else if (req.entity.type === "company") {
      entity = await Company.findById(req.entity.id).select("-password"); 
    } else {
      return res.status(400).json({ message: "Unknown entity type in token" });
    }

    if (!entity) {
      return res.status(404).json({ message: "User or Company not found" });
    }
    
    res.status(200).json({
      id: entity._id,
      name: entity.name || entity.companyName, 
      email: entity.email,
      role: req.entity.type, 
    });
  } catch (error) {
    console.error("Error in getMe controller:", error); 
    res.status(500).json({ message: "Server error" });
  }
};

export const register = async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      role: req.body.role || "user",
    });

    const savedUser = await newUser.save(); 

    const accessToken = generateAccessToken(savedUser);
    const refreshToken = generateRefreshToken(savedUser);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      sameSite: "Lax",
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({message: "User created successfully", user: savedUser, accessToken, refreshToken,});
  } catch (error) {
    console.error("Failed to save user:", error.message);
    res.status(500).json({ message: "Failed to save the user" });
  }
};

export const login = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user)
      return res.status(401).json({ message: "Account with that email doesn't exist" });

    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Wrong password" });

    const accessToken = generateAccessToken(user, "user");
    const refreshToken = generateRefreshToken(user, "user");

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      // sameSite: "Lax",
      maxAge:  15*60*1000, //15 minutes
    });

    res.cookie("refreshToken", refreshToken,{
      httpOnly:true,
      // sameSite: "Lax",
      maxAge: 7*24*60*60*1000, //7 days
    })

    res.status(200).json({
      message: "Login successful",
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const registerCompany = async(req, res) =>{
    try{
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newCompany = new Company({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
    })

    const savedCompany = await newCompany.save();

    const accessToken = generateAccessToken(savedCompany);
    const refreshToken = generateRefreshToken(savedCompany);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      sameSite: "Lax",
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({message: "Company created successfully", company: savedCompany, accessToken, refreshToken})
    }catch(error){
        console.error("Failed to save company:", error.message);
        res.status(500).json({ message: "Failed to save the company" });
    }
}

export const loginCompany = async(req, res)=>{
  try{
    const company = await Company.findOne({email: req.body.email});
    if(!company)
      return res.status(401).json({message: "Company with that email doesn't exist"})

    const isMatch = await bcrypt.compare(req.body.password, company.password);
    if(!isMatch)
      return res.status(401).json({message:"Wrong password"});

    const accessToken = generateAccessToken(company, "company");
    const refreshToken = generateRefreshToken(company, "company");

    es.cookie("accessToken", accessToken, {
      httpOnly: true,
      sameSite: "Lax",
      maxAge:  15*60*1000, //15 minutes
    });

    res.cookie("refreshToken", refreshToken,{
      httpOnly:true,
      sameSite: "Lax",
      maxAge: 7*24*60*60*1000, //7 days
    })

    res.status(200).json({
      message: "Login successful",
      accessToken,
      refreshToken,
    });
    
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
}

export const refresh = (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if(!refreshToken) return res.status(403).json({message: "No refresh token"})

  jwt.verify(refreshToken, process.env.REFRESH_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid refresh token" });
    const accessToken = generateAccessToken(user);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      sameSite: "Lax",
      maxAge: 15 * 60 * 1000,
    });

    res.json({ accessToken });
  });
};
