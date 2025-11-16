import request from "supertest";
import app from "../../backend/app.js";  

describe("User routes", () => {
    describe("GET /users", ()=>{
        it("Should return 200 and a list of users", async () => {
            const res = await request(app).get("/users/");
            expect(res.statusCode).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
        });
    });
    describe("GET /users?role=employee", ()=>{
        it("Should return 200 and a list of employees", async () =>{
            const res = await request(app).get("/users/?role=employee");
            expect(res.statusCode).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
        })
    })
  
});