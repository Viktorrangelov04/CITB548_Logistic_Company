import mongoose from 'mongoose';
import{Schema, model} from 'mongoose';

const orderSchema = new Schema({
    sender:{type:mongoose.Schema.Types.ObjectId, ref: 'User'},
    receiver:{type:mongoose.Schema.Types.ObjectId, ref:'User'},
    employee:{type:mongoose.Schema.Types.ObjectId, ref:'User'},
    adress:{type: String, required: [true, "please enter adress"]},
    weight: {type: String},
    status:{
        type: String, 
        enum:['processing', 'sent', 'arrived', 'received'], 
        default: 'processing', 
        lowercase:true,
    }
})

const Order = model('Order', orderSchema);
export default Order;