import { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";

const handleValidationError =  async(req:Request,res:Response,next:NextFunction)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
       return res.status(400).json({errors: errors.array()});
 }
 next()
 }

 export const validateMyUserRequest = [
    body("name").isString().notEmpty().withMessage("Name must be a string"),
    body("addressLine").isString().notEmpty().withMessage("AddressLine1 must be a string"),
    body("city").isString().notEmpty().withMessage("city must be a string"),
    body("country").isString().notEmpty().withMessage("Country must be a string"),
    handleValidationError
]


export const ValidateCreateProduct =[
    body("title").isString().notEmpty().withMessage("title must be a string"),
    body("price").isString().notEmpty().withMessage("price must be a string"),
    body("category").isString().notEmpty().withMessage("category must be a string"),
    body("avaliableQuantity").isString().notEmpty().withMessage("avaliableQuantity must be a string"),
    body("size").isArray().withMessage("size must be an array").not().isEmpty().withMessage("size array can not be empty"),
    handleValidationError
]