import request from "supertest";
import app from "../../backend/app.js";
import jwt from "jsonwebtoken";

describe("Register, login and check jwt key", ()=>{
    it("Should register a company, login and return proper JWT token", async()=>{
        const createRes= await request(app)
                .post("/auth/register")
                .send({
                    name:"Viktor",
                    email:"viktor@gmail.com",
                    password:"123456",
                })
                .expect(201);
        
        expect(typeof createRes.body.accessToken).toBe("string");
        expect(typeof createRes.body.refreshToken).toBe("string");        
        
        const createdUser = createRes.body.user;

        const decoded = jwt.verify(createRes.body.accessToken, process.env.JWT_SECRET);
        expect(decoded.id).toBe(createdUser._id);
        expect(decoded.role).toBe(createdUser.role);
        
        const loginRes = await request(app)
                .post("/auth/login")
                .send({
                    email:"viktor@gmail.com",
                    password:"123456",
                })
                .expect(200);
        
        expect(typeof loginRes.body.accessToken).toBe("string");
        expect(typeof loginRes.body.refreshToken).toBe("string");

        await request(app).delete(`/users/${createdUser._id}`).expect(200);
    })
})