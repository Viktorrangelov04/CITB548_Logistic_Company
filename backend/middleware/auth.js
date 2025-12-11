import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const accessToken = req.cookies.accessToken; 

  if (!accessToken) {
    return res
      .status(401)
      .json({ message: "No access token, authorization denied" });
  }

  try {

    const decoded = jwt.verify(
      accessToken,
      process.env.JWT_SECRET
    );
    req.entity = decoded; 
    next();
  } catch (err) {
    console.error("Token verification failed:", err.message);
    return res.status(403).json({ message: "Token is not valid or expired" });
  }
};

export const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith("Bearer ")){
        return res.status(401).json({message: "No token provided"});
    }

    const token = authHeader.split(" ")[1];

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }catch(error){
        console.error("Invalid token:", error);
        res.status(403).json({message: "Invalid or expired token"});
    }
}

export const authorize = (req, res, next)=>{
    
}