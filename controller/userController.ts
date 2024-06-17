import { Request, Response } from "express";
import User from "../model/usermodel";


const createUser = async(req:Request,res:Response)=>{
  console.log(req.body)
    try{
      const {auth0Id,email} =req.body
      const existingUser = await User.findOne({auth0Id,email})
      if(existingUser){
        res.status(201).json({message:"User already created!!"})
      }else{
        const newUser = new  User(req.body)
        await newUser.save()
        res.status(201).json({user:newUser.toObject()})
      }
    }catch(error){
      console.log(error)
      res.status(500).json({message:error})
    }
}

export default {createUser}