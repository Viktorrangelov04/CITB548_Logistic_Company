import express from "express";
import {
  createUser,
  getUserById,
  getUsersByRole,
  updateUserRole,
  deleteUser,
} from "../controllers/userController.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/", createUser);
router.get("/:id", getUserById);
router.get("/", getUsersByRole);
router.put("/:id", verifyToken, updateUserRole);
router.delete("/:id", verifyToken, deleteUser);

export default router;
