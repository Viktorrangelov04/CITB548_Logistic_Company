import express from "express";
import {getUserById, getUsersByRole, updateUserRole, deleteUser} from "../controllers/userController.js";

const router = express.Router();

router.get("/:id", getUserById);
router.get("/", getUsersByRole);
router.put("/:id", updateUserRole);
router.delete("/:id", deleteUser);

export default router;