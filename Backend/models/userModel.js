import mongoose, { mongo } from "mongoose";

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        require: true
    },
    email:{
        type: String,
        require: true,
        unique: true,
        //unique: true,Prevent creating multiple users with same email
    },
    password:{
        type: String,
        require: true
    },
    cartData:{
        type: Object,
        default: {}
    },
     testMode: {
        type: Boolean,
        default: false
    },
    paymentStatus: {
        type: String,
        enum: ['Pending', 'Completed', 'Failed'],
        default: 'Pending'
    }
},{minimize: false})

const userModel = mongoose.models.use || mongoose.model("user", userSchema);

export default userModel;