import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/userModel.js";
import Company from "../models/companyModel.js";


const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );
};

const generateRefreshToken = (user) => {
  const refreshToken = jwt.sign(
    { id: user._id },
    process.env.REFRESH_SECRET,
    { expiresIn: "7d" }
  );
  return refreshToken;
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
    res.status(201).json({message: "User created successfully", user: savedUser,});
  } catch (error) {
    console.error("Failed to save user:", error.message);
    res.status(500).json({ message: "Failed to save the user" });
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
    res.status(201).json({message: "Company created successfully", company: savedCompany})
    }catch(error){
        console.error("Failed to save company:", error.message);
        res.status(500).json({ message: "Failed to save the company" });
    }
}

export const login = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user)
      return res.status(401).json({ message: "Account with that email doesn't exist" });

    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Wrong password" });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.cookie("accessToken", accessToken, {
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
};

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
