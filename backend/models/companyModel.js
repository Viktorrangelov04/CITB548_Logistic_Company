import { Schema, model } from 'mongoose';

const companySchema = new Schema({
    name: { type:String, required: true},
    employees: [{type: Schema.Types.ObjectId, ref: 'User'}],
    clients: [{type: Schema.Types.ObjectId, ref: 'User'}]
})

const Company = model('Company', companySchema);
export default Company;