import mongoose from 'mongoose';
import { Schema, model } from 'mongoose';

const companySchema = new Schema({
    name: { type:String, required: [true, "please enter company name"]},
    employees: [{type: Schema.Types.ObjectId, ref: 'User'}],
    clients: [{type: Schema.Types.ObjectId, ref: 'User'}]
})

const Company = model('Company', companySchema);
export default Company;