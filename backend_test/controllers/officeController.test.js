import request from "supertest";
import app from "../../backend/app.js";

describe("Office routes", ()=>{
    describe("GET /office", ()=>{
        it("Should return a list of offices", async()=>{
            const res = await request(app).get("/office");
            expect(res.statusCode).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
        })
    })
    describe("Office API flow", ()=>{
        it("Should Create, read(by id), update and delete office", async()=>{
            const createRes = await request(app)
                .post("/office/")
                .send({
                    address:"Kukurqk 1",
                    company: "691df86883a481d851052b79"
                })
                .expect(201);
            
            const createdOffice= createRes.body.savedOffice;

            const readRes = await request(app).get(`/office/${createdOffice._id}`);

            expect(readRes.statusCode).toBe(200);
            expect(typeof readRes.body).toBe("object");
            expect(readRes.body).not.toBeNull();
            expect(Array.isArray(readRes.body)).toBe(false);
            expect(readRes.body).toHaveProperty("address", "Kukurqk 1");
            expect(readRes.body).toHaveProperty("company", "691df86883a481d851052b79");

            const updateRes = await request(app)
                .put(`/office/${createdOffice._id}`)
                .send({address:"Kukurqk 2"})
                .expect(200);
            
            expect(updateRes.body.address).toBe("Kukurqk 2");

            await request(app).delete(`/office/${createdOffice._id}`).expect(200);
            await request(app).get(`/office/${createdOffice._id}`).expect(404);
        })
    })
})