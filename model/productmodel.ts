import mongoose, { InferSchemaType } from "mongoose";


const ProductSchema = new mongoose.Schema({
    _id:{type: mongoose.Schema.Types.ObjectId,required:true,
        default:()=> new mongoose.Types.ObjectId(),
    },
    user:{type:mongoose.Schema.Types.ObjectId,ref:"User"},
    title:{type:String,required:true},
    price:{type:Number,require:true},
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

export type ProductType = InferSchemaType<typeof ProductSchema>;

const Product = mongoose.model("Product",ProductSchema)

export default Product