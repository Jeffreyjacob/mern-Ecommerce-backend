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

export default {getAllProduct,getProductById,getRelatedProduct}