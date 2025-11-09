import Office from "../models/officeModel.js"

export const getOfficeByID = async(req, res) =>{
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
}

export const getOffices = async(req, res) => {
    try{
        const offices = await Office.find();
        res.status(200).json(offices)
    }catch{
        res.status(500).json({message:"failed to fetch offices"})
    }
}

export const createOffice = async(req, res)=>{
    const newOffice = new Office({adress: req.body.address, company:req.body.company})
    try{
        const savedOffice=await newOffice.save();
        res.status(201).json({message: "Office saved successfully", savedOffice});
    }catch{
        res.status(500).json({message:"failed to save office"});
    }
}

export const editOfficeAddress = async(req, res)=>{
    const { id } = req.params;
    const { address } = req.body;
    if(!id || !address ){
        res.status(400).json({message: "missing ID or address"})
    }
    try{
        const result = await Office.findByIdAndUpdate(id, { address }, { new: true });
        if (!result) return res.status(404).json({ message: "Office not found" });
    }catch{
        res.status(500).json({message: "Server error"})
    }
}

export const deleteOffice = async(req, res) =>{
    const {id} = req.params; 
    if(!id){
        return res.status(400).json({message:"Missing office ID"})
    }
    try{
        const result = await Office.findByIdAndDelete(id);
        if (!result) return res.status(404).json({ message: "Office not found"});

        res.status(200).json({message: "Office deleted successfully"})
    }catch{
        res.status(500).json({message: "server error"})
    }
}