import mongoose from "mongoose";

const wishlistShema = new mongoose.Schema({
   title:{type:String,required:true},
   price:{type:Number,required:true},
   Id:{type:String,required:true},
   user:{type:mongoose.Schema.Types.ObjectId,ref:"User"},
   imageUrl:{type:String,required:true},
   createAt:{type:Date,default:Date.now}
})

const Wishlist = mongoose.model("Wishlist",wishlistShema)

export default Wishlist;