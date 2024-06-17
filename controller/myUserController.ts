import { Request, Response } from "express";
import User from "../model/usermodel";


const UpdateUser = async(req:Request,res:Response)=>{
    try{
      const {name,addressLine,city,country} = req.body
      const user = await User.findById(req.userId)
      if(!user){
       return res.status(404).json({message:"Unauthorized!!"})
      }
      user.name = name;
      user.addressLine = addressLine;
      user.city = city;
      user.country = country;
      await user.save();
      res.status(200).json();
    }catch(error){
       console.log(error)
       res.status(500).json({message:error})
    }
}

const getUser = async (req:Request,res:Response)=>{
    try{
      const user = await User.findOne({_id:req.userId})
      if(!user){
        return res.status(404).json({message:"Unauthenticated!!"})
      }
      res.status(200).json(user)
    }catch(error){
      console.log(error)
      res.status(500).json({message:error})
    }
}
 
export default {UpdateUser,getUser}