import express from "express";
import { register, registerCompany, login, refresh, loginCompany } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", register);
router.post("/register-company", registerCompany);
router.post("/login", login);
router.post("/login-company", loginCompany);
router.post("/refresh", refresh);

export default router;