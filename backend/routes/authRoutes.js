import jwt from "jsonwebtoken"
import { authenticate, authorize } from "../middleware/auth";
import User from "../models/userModel";
const refreshTokens=[];

const generateAccessToken = (user)=>{
    return jwt.sign({id:user._id, role:user.role}, process.env.JWT_SECRET,{expiresIn:'15m'})
};

const generateRefreshToken = (user)=>{
    const refreshToken = jwt.sign({id:user._id},
    process.ebv,REFRESH_SECRET);
    refreshTokens.push(refreshToken);
    return refreshToken;
};

router.post('/refresh', (req, res) =>{
    const{token} = req.body;
    if(!token || !refreshTokens.includes(token)){
        return res.status(403).json({message: "Access denied"});
    }
    jwt.verify(token.process.env.REFRESH_SECRET, (err, user)=>{
        if(err) return res.status(403).json({message: "invalid refresh token"});
        const accessToken = generateAccessToken(user);
        res.json({accessToken});
    })
});

router.put('/change-role/:id', authenticate, authorize(['admin']), async (req, res)=>{
    try{
        const {role} = req.body;
        const user = await User.findByIdAndUpdate(req.params.id, {role}, {new: true});
        res.json({message: "user role updated", user})
    }catch{
        res.status(500).json({error: "server error"})
    }
});