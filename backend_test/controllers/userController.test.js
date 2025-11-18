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
            if(res.body.length>0){
                const allEmployees=res.body.every(
                    (user)=>user.role && user.role === "employee"
                );
                expect(allEmployees).toBe(true);
            }
        });
    });
    describe("User API flow", ()=>{
        it("Should create, read(by id), update and delete a user", async()=>{
            const createRes= await request(app)
                .post("/auth/register")
                .send({
                    name:"Viktor",
                    email:"viktor@gmail.com",
                    password:"123456",
                })
                .expect(201);
            
            const createdUser = createRes.body.user;
            

            const readRes = await request(app).get(`/users/${createdUser._id}`)

            expect(readRes.statusCode).toBe(200);
            expect(typeof readRes.body).toBe("object");
            expect(readRes.body).not.toBeNull();
            expect(Array.isArray(readRes.body)).toBe(false);
            expect(readRes.body).toHaveProperty("name", "Viktor");
            expect(readRes.body).toHaveProperty("_id", createdUser._id.toString());   
            
            const updateRes= await request(app)
                .put(`/users/${createdUser._id}`)
                .send({ role: "employee"})
                .expect(200);
                
            expect(updateRes.body.user.role).toBe("employee");

            await request(app).delete(`/users/${createdUser._id}`).expect(200);

            await request(app).get(`/users/${createdUser._id}`).expect(404);
        })
    })
});