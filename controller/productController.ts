import  { Request, Response } from "express";
import Product from "../model/productmodel";
import { check } from "express-validator";


const getAllProduct = async(req:Request,res:Response)=>{
   try{
      const product = await Product.find()
      res.status(200).json({data:product})
   }catch(error){
     console.log(error)
     res.status(500).json({message:error})
   }
}

const getProductById = async(req:Request,res:Response)=>{
    try{
      const {id} = req.params
      const product = await Product.findById(id)
      if(!product){
         res.status(404).json({message:"Product not found"})
      }
      res.status(200).json(product)
    }catch(error){
        console.log(error)
        res.status(500).json({message:error})
    }
}

const getRelatedProduct = async(req:Request,res:Response)=>{
      try{
        const {id} = req.params
        const checkProduct = await Product.findOne({_id:id})
        if(!checkProduct){
          res.status(404).json({Message:"Product not found"})
        }
        const condtion = {_id:{$ne:id},category:checkProduct?.category};
        const product = await Product.find(condtion)
        if(product.length === 0){
         res.status(200).json({data:[]})
        }
        res.json({data:product})
      }catch(error){
        console.log(error)
        res.status(500).json({message:error})
      }
}

  const SearchProduct = async (req:Request,res:Response)=>{
     try{
        const querySearch = (req.query.searchQuery as string) || ""
        const price = (req.query.price as string) || ""
        const category = (req.query.category as string) || ""
        const size = (req.query.size as string) || ""
        const page = parseInt(req.query.page  as string) || 1

        let query:any = {}
        const totalProduct = await Product.countDocuments(query)
        if(querySearch){
           const searchRegex = new RegExp(querySearch,'i')
           query.title = { $regex: searchRegex };
        }
        if(price){
          query.price = { $lte:parseFloat(price)};
        }
        if(size){
          const sizeArray = size.split(",").map(
            (size)=> RegExp(size,"i")
          )
          query.size = {$all:sizeArray}
        }
        const validateCategories = ["clothes","shoes","jeweleries","other-accessories"]
        if(category && validateCategories.includes(category)){
            query.category = {$all:category}
        }
        const pageSize = 9
        const skip = (page - 1) * pageSize
        const product = await Product.find(query).skip(skip).limit(pageSize).lean()
        res.status(200).json({
          data:product,
          pagination:{
            totalProduct,
            page,
            pages:Math.ceil(totalProduct/pageSize),
          }
        })
     }catch(error){
      console.log(error)
      res.status(500).json({message:error})
     }
  }

export default {getAllProduct,getProductById,getRelatedProduct,SearchProduct}