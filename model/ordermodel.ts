import mongoose from "mongoose";


const OrderSchema = new mongoose.Schema({
 user:{type:mongoose.Schema.Types.ObjectId,ref:"User"},
 deliveryDetails:{
    email:{type:String,required:true},
    name:{type:String,required:true},
    addressLine1:{type:String,required:true},
    city:{type:String,required:true}
 },
 cartItems:[
    {
       id:{type:String,required:true},
       title:{type:String,required:true},
       quantity:{type:Number,required:true},
       imageUrl:{type:String,required:true},
       price:{type:Number,required:true}
    }
 ],
 totalAmount:Number,
 status:{
    type:String,
    enum:["placed","paid","shipped","delivered"]
 },
 createdAt:{type:Date,default:Date.now}
})

const Order = mongoose.model("Order",OrderSchema)

export default Order;