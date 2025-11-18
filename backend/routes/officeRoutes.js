import express from "express";
import { getOfficeByID, getOffices, createOffice, editOfficeAddress, deleteOffice } from "../controllers/officeController.js";

const router = express.Router();

router.get("/:id", getOfficeByID)
router.get("/", getOffices)
router.post("/", createOffice)
router.put("/:id", editOfficeAddress)
router.delete("/:id", deleteOffice)

export default router;