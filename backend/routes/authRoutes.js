import express from "express";
import { register, registerCompany, login, refresh, loginCompany, getMe } from "../controllers/authController.js";
import { verifyToken } from "../middleware/auth.js";
const router = express.Router();

router.get("/me", verifyToken, getMe);
router.post("/register", register);
router.post("/register-company", registerCompany);
router.post("/login", login);
router.post("/login-company", loginCompany);
router.post("/refresh", refresh);

export default router;