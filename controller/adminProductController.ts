import { Request, Response, query } from "express"
import Product from "../model/productmodel";
import cloudinary from 'cloudinary';
import mongoose from "mongoose";
import User from "../model/usermodel";




const createProduct = async(req:Request,res:Response)=>{
    try{
      const imageUrl = await UploadImage(req.file as Express.Multer.File)
      const product = new Product(req.body);
      product.user = new mongoose.Types.ObjectId(req.userId);
      product.imageUrl = imageUrl;
      product.lastUpdate = new Date();
      await product.save()
      res.status(201).json(product)
    }catch(error){
      console.log(error)
      res.status(500).json({message:error})
    }
}



const getProductbyUser = async(req:Request,res:Response)=>{
    try{
        const searchQuery = (req.query.searchQuery as string) || "";
        const page = parseInt(req.query.page as string) || 1;
        const itemsPerPage = 10;

      const user = await User.findById(req.userId)
      if(!user){
         res.status(404).json({message:"User not found"})
      }

      let query: any = { user: req.userId };
      if(searchQuery){
        const searchRegex = new RegExp(searchQuery,'i')
        query.title = { $regex: searchRegex };
      }

      const product = await Product.find(query).skip((page - 1) * itemsPerPage).limit(itemsPerPage);
      const total = await Product.countDocuments(query)
      if(product.length === 0){
       return res.status(200).json({data:[],pagination:{
        total,
        page,
        pages:Math.ceil(total/itemsPerPage)
     }})
      }
      res.status(200).json({
        data:product,
        pagination:{
            total,
            page,
            pages:Math.ceil(total/itemsPerPage)
         }
      })
    }catch(error){
      console.log(error)
      res.status(500).json({message:error})
    }
}

const UploadImage = async(file:Express.Multer.File)=>{
  const image = file
  const base64Image = Buffer.from(image.buffer).toString("base64")
  const dataURI = `data:${image.mimetype};base64,${base64Image}`;
  const uploadResponse = await cloudinary.v2.uploader.upload(dataURI)
  return uploadResponse.url;
}


export default {createProduct,getProductbyUser}