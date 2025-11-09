import User from "../models/userModel.js";
import Company from "../models/companyModel.js";

export const getCompanyById = async(req, res) =>{
    const { id } = req.params;
    try{
        const company = await Company.findById(id);
        if(!company){
            return res.status(404).json({message:"Company not found"});
        }

        res.status(200).json(company);
    }catch{
        res.status(500).json({message:"Server error"});
    }
}

export const getCompanies = async(req,res) =>{
    try{
        const companies = await Company.find();
        res.status(200).json(companies);
    }catch{
        res.status(500).json({message:"Server error"})
    }
}

export const deleteCompany = async(req, res) =>{
    const { id } = req.params;
    if(!id) return res.status(404).json({message: "Missing company ID"});
    try{
        const result = Company.findByIdAndDelete(id);
        if(!result) return res.status(404).json({message:"Company not found"})
        res.status(200).json({message:"Company deleted successfully"})
    }catch{
        res.status(500).json({message:"Server error"})
    }
}

export const changeUserRole = async (req, res) => {
    const { role } = req.body;
    try {
        const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json({ message: "User role updated", user });
    }catch (error) {
        res.status(500).json({ error: "Server error", detail: error.message });
    }
};