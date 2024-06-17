import { NextFunction, Request, Response } from "express";
import { auth } from "express-oauth2-jwt-bearer";
import jwt, { JwtPayload } from "jsonwebtoken";
import User from "../model/usermodel";

declare global{
    namespace Express{
        interface Request{
            userId:string,
            auth0Id:string
        }
    }
}

export const jwtCheck = auth({
    audience:process.env.AUTH0_AUDIENCE,
    issuerBaseURL:process.env.AUTH0_ISSUER_BASE_URL,
    tokenSigningAlg: 'RS256'
  });

export const JwtParse = async (req:Request,res:Response,next:NextFunction)=>{
   const {authorization}  = req.headers;
   if(!authorization || !authorization.startsWith("Bearer ")){
      res.status(404).json({message:"Please provide a Bearer Token"})
   }
   try{
    const token = authorization?.split(' ')[1] as string
    const decoded  = jwt.decode(token) as JwtPayload 
    const auth0Id = decoded.sub
    const user = await User.findOne({auth0Id})
    if(!user){
        res.status(404).json({message:"Unauthorized!!"})
    }
     req.userId = user?.id.toString();
     req.auth0Id = auth0Id as string
     next()
   }catch(error){
     console.log(error)
     res.status(400).json({message:error})
   }
}
