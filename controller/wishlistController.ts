import { Request, Response } from "express";
import Wishlist from "../model/wishlistmodel";
import mongoose from "mongoose";


const createWishlist = async (req: Request, res: Response) => {
    try {
        console.log(req.body)
        const existingWishlist = await Wishlist.findOne({Id: req.body.Id })
        if (existingWishlist){
            const removeWishList = await Wishlist.findOneAndDelete({Id:req.body.Id})
            return res.status(200).json({message:"Removed from wishlist"})
        }
            const wishlist = new Wishlist()
            wishlist.Id = req.body.Id,
            wishlist.imageUrl = req.body.imageUrl,
            wishlist.title = req.body.title,
            wishlist.price = req.body.price
            wishlist.user = new mongoose.Types.ObjectId(req.userId);
            await wishlist.save()
           res.status(200).json({message:"Added to wishlist"})
    
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error })
    }
}

const getWishList = async (req:Request,res:Response)=>{
      try{
       const wishlist = await Wishlist.find({user:req.userId})
       res.status(200).json(wishlist)
      }catch(error){
       console.log(error)
       res.status(500).json({message:error})
      }
}

export default { createWishlist,getWishList}