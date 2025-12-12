import mongoose from 'mongoose';
import{Schema, model} from 'mongoose';

const orderSchema = new Schema({
    sender:{type:mongoose.Schema.Types.ObjectId, ref: 'User'},
    receiver:{type:mongoose.Schema.Types.ObjectId, ref:'User'},
    employee:{type:mongoose.Schema.Types.ObjectId, ref:'User'},
    office:{type:mongoose.Schema.Types.ObjectId, ref:'Office'},
    adress:{type: String, required: [true, "please enter adress"]},
    weight: {type: String},
    status:{
        type: String, 
        enum:['processing', 'shipping', 'delivered', 'received'], 
        default: 'processing', 
        lowercase:true,
    },
    type:{
        type: String,
        enum:['office', 'adress'],
        lowercase:true,
        required:[true, "please enter order type"],
    },
    price:{type: mongoose.Schema.Types.Decimal128}
})

const Order = model('Order', orderSchema);
export default Order;