// import request from "supertest";
// import app from "../../backend/app.js";

// describe("Office routes", ()=>{
//     describe("GET /office", ()=>{
//         it("Should return a list of offices", async()=>{
//             const res = await request(app).get("/office");
//             expect(res.statusCode).toBe(200);
//             expect(Array.isArray(res)).toBe(true);
//         })
//     })
//     describe("Office API flow", ()=>{
//         it("Should Create, read(by id), update, delete office", async()=>{
//             const createRes = await request(app)
//                 .post("/auth/register-company")
//                 .send({
//                     name: "viktor's company",
//                     email: "viktor@gmail.com",
//                     password: "123456"
//                 })
//                 .expect(201);
            
//             const createdCompany = createRes.company;
//             const readRes = await request(app).get
//         })
//     })
// })