import mongoose from 'mongoose';
import {Schema, model} from 'mongoose';

const officeSchema = new Schema({
    address: {type: String, required: [true, "please enter office adress"]},
    company: {type:mongoose.Schema.Types.ObjectId, ref:'Company'},
})

const Office = model('Office', officeSchema);
export default Office;