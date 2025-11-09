import jwt from "jsonwebtoken";

export function setUserTokenCookie(req, res){
    const token = jwt.sign(
        {id: user._id, email: user.email}, 
    )
}