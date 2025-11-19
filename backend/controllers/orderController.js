import Order from "../models/orderModel.js";

export const getOrderById = async(req, res) =>{
    const { id } = req.params;
    if(!id) return res.status(400).json({message:"Missing order ID"})
    
    try{
        const order = await Order.findById(id);
        if(!order) return res.status(404).json({message: "Order not found"});

        res.status(200).json(order);
    }catch{
        res.status(500).json({message:"Server error"});
    }
}

export const getOrderByStatus = async(req, res) =>{
    const {status} = req.query;
    try{
        const orders = status ? await Order.find({status}) : await Order.find();

        res.status(200).json(orders)
    }catch(err){
        console.error("ACTUAL ERROR in getOrderByStatus:", err);
        res.status(500).json({message: "failed to get orders"})
    }
}

export const createOrder = async(req, res) =>{
    const newOrder = new Order({sender: req.body.sender_id, receiver: req.body.receiver_id, adress: req.body.adress, weight: req.body.weight});
    try{
        const savedOrder = await newOrder.save();
        res.status(201).json({msasage: "order saved successfully", order:savedOrder})
    }catch{
        res.status(500).json({message: "failed to save order"})
    }
}

export const editOrderStatus = async(req, res)=>{
    const {id} = req.params;
    const {status} = req.body;

    if (!id || !status) {
    return res.status(400).json({ message: "Missing order ID or status" });
    }

    try{
        const updatedOrder = await Order.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );
        if (!updatedOrder) {
            return res.status(404).json({ message: "Order not found" });
        }

        res.status(200).json(updatedOrder);
    }catch (err) {
        console.error("Failed to edit order:", err.message);
        res.status(500).json({ message: "Server error" });
    }
}

export const deleteOrder = async(req,res) =>{
    const { id } = req.params;
    if(!id){
        return res.status(400).json({message:"Missing order ID"})
    }

    try{
        const deletedOrder = await Order.findByIdAndDelete(id);

        if (!deletedOrder) {
            return res.status(404).json({ message: "Order not found" });
        }

        res.status(200).json({ message: "Order deleted successfully" });
    }catch(err){
        console.error("Failed to delete order:", err.message);
        res.status(500).json({ message: "Server error" });
    }
}