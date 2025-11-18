import request from "supertest";
import app from "../../backend/app.js";

describe("Order routes", ()=>{
    describe("GET /orders", ()=>{
        it("Should return 200 and list of orders", async()=>{
            const res = await request(app).get("/orders/");
            expect(res.statusCode).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
        })
        it("Should return 200 and orders by status", async()=>{
            const res = await request(app).get("/orders/?status=processing")
            expect(res.statusCode).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
            if(res.body.length>0){
                const allOrders = res.body.every(
                    (order)=>order.status && order.status == "processing"
                );
                expect(allOrders).toBe(true);
            }
        })
    })
    describe("Order API flow",()=>{
        it("Should create, read(by id), update and delete order", async()=>{
            const createRes = await request(app)
                .post("/orders/")
                .send({
                    sender_id: "68fa57eaa1a3340fa0602112",
                    receiver_id: "68fa58ff1136ad9d114c4cbc",
                    adress: "nbu",
                    weight: "500"
                })
                .expect(201)
            
            const createdOrder = createRes.body.order;
        
            const readRes = await request(app).get(`/orders/${createdOrder._id}`);

            expect(readRes.statusCode).toBe(200);
            expect(typeof readRes.body).toBe("object");
            expect(readRes.body).not.toBeNull();
            expect(Array.isArray(readRes.body)).toBe(false);
            expect(readRes.body).toHaveProperty("weight", "500")
            expect(readRes.body).toHaveProperty("_id", createdOrder._id.toString());

            const updateRes = await request(app)
                .put(`/orders/${createdOrder._id}`)
                .send({status:"sent"})
                .expect(200);
            expect(updateRes.body.status).toBe("sent");

            await request(app).delete(`/orders/${createdOrder._id}`).expect(200);

            await request(app).get(`/orders/${createdOrder._id}`).expect(404);
        })
    })
})