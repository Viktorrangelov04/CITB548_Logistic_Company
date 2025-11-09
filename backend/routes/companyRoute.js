import express from "express";
import Company from "../models/companyModel.js";

const router = express.Router();

router.get("/:id", async(req, res)=> {
    const { id } = req.params;

    if(!id){
        return res.status(400).json({message:"Missing company ID"})
    }

    try{
        const company = await Company.findById(id);
        if(!company){
            return res.status(404).json({message:"Company not found"})
        }
        res.status(200).json(company);
    }catch{
        res.status(500).json({message:"Server error"})
    }
})