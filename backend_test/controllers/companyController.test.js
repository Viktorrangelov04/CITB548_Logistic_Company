import request from "supertest";
import app from "../../backend/app.js";

describe("Company routes", ()=>{
    describe("GET /company",()=>{
        it("Should return 200 and list of companies", async()=>{
            const res = await request(app).get("/company");
            expect(res.statusCode).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
        })
    })
    describe("Company API flow", ()=>{
        it("Should Create, read(by id), update, delete company", async()=>{
            const createRes = await request(app)
                .post("/auth/register-company")
                .send({
                    name: "viktor's company",
                    email: "viktor@gmail.com",
                    password: "123456"
                })
                .expect(201);
            
            const createdCompany = createRes.body.company;

            const readRes = await request(app).get(`/company/${createdCompany._id}`);
            
            expect(readRes.statusCode).toBe(200);
            expect(typeof readRes.body).toBe("object");
            expect(readRes.body).not.toBeNull();
            expect(Array.isArray(readRes.body)).toBe(false);
            expect(readRes.body).toHaveProperty("name", "viktor's company")
            expect(readRes.body).toHaveProperty("_id", createdCompany._id.toString());

            await request(app).delete(`/company/${createdCompany._id}`).expect(200);

            await request(app).get(`/company/${createdCompany._id}`).expect(404);
        })
    })
})