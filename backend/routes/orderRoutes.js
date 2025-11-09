import express from "express";
import Order from "../models/orderModel.js";

const router = express.Router();

router.get("/:id", async(req, res)=>{
    const {id} = req.params;
    if(!id){
        return res.status(400).json({message:"Missing order ID"})
    }
    try{
        const order = await Order.findById(id);
        if(!order){
            return res.status(404).json({message: "Order not found"});
        }
        res.status(200).json(order);
    }catch{
        res.status(500).json({message:"Server error"});
    }
})//Get order by ID

router.get("/", async(req, res)=>{
    const {status} = res.query;
    if(!status){
        return res.status(400).json({message:"Missing new status"})
    }
    try{
        const orders = role ? await Order.find({status}) : await Order.find();
        res.status(200).json(orders)
    }catch{
        res.status(500).json({message: "failed to get orders"})
    }
})//Get orders by status

router.post("/", async(req, res) =>{
    const newOrder = new Order({sender: req.body.sender_id, receiver: req.body.receiver_id, adress: req.body.adress, weight: req.body.weight});
    try{
        const savedOrder = await newOrder.save();
        console.log("new order saved", savedOrder);
        res.status(201).json({msasage: "order saved successfully", order:savedOrder})
    }catch{
        res.status(500).json({message: "failed to save order"})
    }
})//Create order

router.put("/:id", async(req, res)=>{
    const {id} = req.params;
    const {status} = req.body;

    if (!id || !status) {
    return res.status(400).json({ message: "Missing order ID or status" });
    }

    try{
        const result = await db.collection('order').updateOne(
            {_id: new ObjectId(id)},
            {$set:{'status':status}}
        )
        if(result.matchedCount === 0){
            return res.status(404).json({message: "Order not found"})
        }
        res.status(200).json({message: "Status updated successfully"})
    }catch{
        res.status(500).json({message: "server error"});
    }
})//Edit order status

router.delete("/:id", async(req, res)=>{
    const { id } = req.params.id;
    if(!id){
        return res.status(400).json({message:"Missing order ID"})
    }

    try{
        const result = await db.collection("order").deleteOne({
            _id: new ObjectId(id),
        });
        if(result.deletedCount === 0){
            return res.status(404).json({ message: "Order not found"});
        }

        res.status(200).json({message: "order deleted successfully"})
    }catch{
        res.status(500).json({message: "server error"})
    }
})//Delete order by ID
export default router;