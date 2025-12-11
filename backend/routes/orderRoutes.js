import express from "express";
import { getOrderById, getOrders, createOrder, editOrderStatus, deleteOrder } from "../controllers/orderController.js";
import {verifyToken} from "../middleware/auth.js";
const router = express.Router();

router.get("/:id", getOrderById);
router.get("/", verifyToken, getOrders);
router.post("/", createOrder);
router.put("/:id", editOrderStatus);
router.delete("/:id", deleteOrder);

export default router;