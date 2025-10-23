import{Schema, model} from 'mongoose';

const orderSchema = new Schema({
    sender:{type:mongoose.Schema.Types.ObjectId, ref: 'User'},
    receiver:{type:mongoose.Schema.Types.ObjectId, ref:'User'},
    employee:{type:mongoose.Schema.Types.ObjectId, ref:'User'},
    address:{Type: String, required:true},
    weight: {Type: Number, required:true},
    status:{type: String, enum:['sent', 'arrived', 'received'], default: 'sent'}
})