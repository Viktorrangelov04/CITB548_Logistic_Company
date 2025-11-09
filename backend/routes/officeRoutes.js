import express from "express";
import Office from "../models/officeModel.js";
const router = express.Router();

router.get("/:id",async(req, res)=>{
    const { id } = req.params;
    if(!id){
        return res.status(400).json({message:"Missing office ID"})
    }
    try{
        const office = await Office.findById(id);

        if(!office){
            return res.status(404).json({message: "Office not found"});
        }
        res.status(200).json(office);
    }catch{
        res.status(500).json({message:"Server error"})
    }
})//Finding office by ID

router.get("/", async(req, res)=>{
    try{
        const offices = await Office.find();
        res.status(200).json({offices})
    }catch{
        res.status(500).json({message:"failed to fetch offices"})
    }
})//Finding all offices

router.post("/", async(req, res)=>{
    const newOffice = new Office({adress: req.body.adress, company:req.body.company})
    try{
        const savedOffice=newOffice.save();
        res.status(201).json({message: "Office saved successfully", savedOffice});
    }catch{
        res.status(500).json({message:"failed to save office"});
    }
})//Creating office

router.put("/:id", async(req, res)=>{
    const { id } = req.params
    const { address } = req.body;

    if(!id || !address ){
        res.status(400).json({message: "missing ID or address"})
    }

    try{
        const result = await db.collection("office").updateOne(
            {_id: new ObjectId(id) },
            {$set:{"address":address}}
        )
    }catch{
        res.status(500).json({message: "Server error"})
    }
})//Editting office address

router.delete("/:id", async(req, res)=>{
    const {id} = req.params; 
    if(!id){
        return res.status(400).json({message:"Missing office ID"})
    }
    try{
         const result = await db.collection("office").deleteOne({
            _id: new ObjectId(id),
        });
        if(result.deletedCount === 0){
            return res.status(404).json({ message: "Office not found"});
        }

        res.status(200).json({message: "Office deleted successfully"})
    }catch{
        res.status(500).json({message: "server error"})
    }
})//Deleting office by ID

export default router;