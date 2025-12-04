import express from "express";
import { getOrderById, getOrderByStatus, createOrder, editOrderStatus, deleteOrder } from "../controllers/orderController.js";

const router = express.Router();

router.get("/:id", getOrderById);
router.get("/", getOrderByStatus);
router.post("/", createOrder);
router.put("/:id", editOrderStatus);
router.delete("/:id", deleteOrder);

export default router;