import request from "supertest";
import app from "../../backend/app.js";
import jwt from "jsonwebtoken";
import {generateAccessToken} from "../../backend/controllers/authController.js";

describe("generateAccessToken"), ()=> {
    const user = { _id: "12345", role: "user"};

    beforeAll(()=>{
        process.env.JWT_SECRET = "testsecret";
    })

    it("Should return a valid JWT", ()=>{
        const token = generateAccessToken(user);
        expect(typeof token).toBe("string");

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        expect(decoded.id).toBe(user._id);
        expect(decoded.role).toBe(user.role);
    })
}