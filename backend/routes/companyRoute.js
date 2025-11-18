import express from "express";
import Company from "../models/companyModel.js";
import {getCompanyById, getCompanies, deleteCompany, changeUserRole} from "../controllers/companyController.js";
const router = express.Router();

router.get("/:id", getCompanyById);
router.get("/", getCompanies);
router.put("/:id", changeUserRole);
router.delete("/:id", deleteCompany);

export default router;