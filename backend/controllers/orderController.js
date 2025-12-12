import Order from "../models/orderModel.js";

export const getOrderById = async (req, res) => {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: "Missing order ID" });

    try {
        const order = await Order.findById(id);
        if (!order) return res.status(404).json({ message: "Order not found" });

        res.status(200).json(order);
    } catch {
        res.status(500).json({ message: "Server error" });
    }
};

export const getOrders = async (req, res) => {
  try {
    const currentUserId = req.entity.id;
    const userRole = req.entity.type;
    const status = req.query.status; 
    const type = req.query.type;

    let query = {};

    if (userRole === 'employee') {
      if (status) {
        query.status = status;
      }
    } else if (userRole === 'user') { 
      const userSpecificConditions = [];

      if (type === 'sent') {
        userSpecificConditions.push({ sender: currentUserId });
      } else if (type === 'received') {
        userSpecificConditions.push({ receiver: currentUserId });
      } else { 
        userSpecificConditions.push({ sender: currentUserId });
        userSpecificConditions.push({ receiver: currentUserId });
      }

      if (userSpecificConditions.length > 0) {
        query.$or = userSpecificConditions;
      }

      if (status) {
        query.status = status; 
      }
    } else {
      return res.status(403).json({ message: 'Unauthorized role to view orders' });
    }

    const orders = await Order.find(query)
      .populate('sender', 'name email')
      .populate('receiver', 'name email');

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: 'No orders found.' });
    }

    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

export const createOrder = async (req, res) => {
    const newOrder = new Order({
        sender: req.body.sender_id,
        receiver: req.body.receiver_id,
        adress: req.body.adress,
        weight: req.body.weight,
        type: req.body.type,
    });
    if(newOrder.type="office"){
        newOrder.price=newOrder.weight/200
    }else if(newOrder.type="adress"){
        newOrder.price=newOrder.weight/175
    }else{
        return res.status(400).json({
        message: "Invalid or missing order type. Type must be 'office' or 'adress'.",
        });
    }
    
    try {
        const savedOrder = await newOrder.save();
        res.status(201).json({
            msasage: "order saved successfully",
            order: savedOrder,
        });
    } catch {
        res.status(500).json({ message: "failed to save order" });
    }
};

export const editOrderStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!id || !status) {
        return res.status(400).json({ message: "Missing order ID or status" });
    }

    try {
        const updatedOrder = await Order.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );
        if (!updatedOrder) {
            return res.status(404).json({ message: "Order not found" });
        }

        res.status(200).json(updatedOrder);
    } catch (err) {
        console.error("Failed to edit order:", err.message);
        res.status(500).json({ message: "Server error" });
    }
};

export const deleteOrder = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ message: "Missing order ID" });
    }

    try {
        const deletedOrder = await Order.findByIdAndDelete(id);

        if (!deletedOrder) {
            return res.status(404).json({ message: "Order not found" });
        }

        res.status(200).json({ message: "Order deleted successfully" });
    } catch (err) {
        console.error("Failed to delete order:", err.message);
        res.status(500).json({ message: "Server error" });
    }
};
