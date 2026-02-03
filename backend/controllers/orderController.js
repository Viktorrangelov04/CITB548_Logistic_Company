import Order from "../models/orderModel.js";

export const getOrderById = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "Missing order ID" });
  }

  try {
    const order = await Order.findById(id)
      .populate("sender", "name email")
      .populate("receiver", "name email");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error("Get order by id error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getOrders = async (req, res) => {
  try {
    const currentUserId = req.entity.id;
    const userRole = req.entity.type;
    const { status, type } = req.query;

    let query = {};

    if (userRole === "employee-office" || userRole === "employee-courier") {
      if (status) {
        query.status = status;
      }
    } else if (userRole === "client") {
      const conditions = [];

      if (type === "sent") {
        conditions.push({ sender: currentUserId });
      } else if (type === "received") {
        conditions.push({ receiver: currentUserId });
      } else {
        conditions.push({ sender: currentUserId });
        conditions.push({ receiver: currentUserId });
      }

      query.$or = conditions;

      if (status) {
        query.status = status;
      }
    } else {
      return res
        .status(403)
        .json({ message: "Unauthorized role to view orders" });
    }

    const orders = await Order.find(query)
      .populate("sender", "name email")
      .populate("receiver", "name email");

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createOrder = async (req, res) => {
  try {
    const { sender_id, receiver_id, address, weight, type, office } = req.body;

    if (!receiver_id || !address || !weight || !type) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newOrder = new Order({
      sender: sender_id,
      receiver: receiver_id,
      address,
      weight,
      type,
      office: office || null,
    });

    if (type === "office") {
      newOrder.price = weight / 200;
    } else if (type === "address") {
      newOrder.price = weight / 175;
    } else {
      return res.status(400).json({
        message: "Invalid order type. Must be 'office' or 'address'",
      });
    }

    const savedOrder = await newOrder.save();

    res.status(201).json({
      message: "Order created successfully",
      order: savedOrder,
    });
  } catch (error) {
    console.error("Create order error:", error);
    res.status(500).json({ message: "Failed to create order" });
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
      { new: true },
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json(updatedOrder);
  } catch (error) {
    console.error("Edit order error:", error);
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
  } catch (error) {
    console.error("Delete order error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
