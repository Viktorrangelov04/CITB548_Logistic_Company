import mongoose from 'mongoose';
import { Schema, model } from 'mongoose';

const companySchema = new Schema({
    name: { type:String, required: [true, "please enter company name"]},
    email: {type: String, required: true},
    password: {type: String, required: true},
    employees: [{type: mongoose.Schema.Types.ObjectId, ref: 'User', default: []}],
    clients: [{type: mongoose.Schema.Types.ObjectId, ref: 'User', default: []}]
})

const Company = model('Company', companySchema);
export default Company;