import mongoose from "mongoose";


const ProductSchema = new mongoose.Schema({
    user:{type:mongoose.Schema.Types.ObjectId,ref:"User"},
    title:{type:String,required:true},
    price:{type:String,require:true},
    category:{type:String,
    enum:["clothes","shoes","jeweleries","other-accessories"]},
    description:{type:String,required:true},
    avaliableQuantity:{type:String,required:true},
    size:[{type:String,required:true}],
    AddedToCart:{type:Boolean,default:false},
    AddedToWishList:{type:Boolean,default:false},
    imageUrl:{type:String,required:true},
    lastUpdate:{type:Date,required:true}
})

const Product = mongoose.model("Product",ProductSchema)

export default Product