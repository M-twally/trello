

import userModel from "../../../../DB/models/user.model.js"
import { asyncHandler } from "../../../utils/errror.handling.js"
import router from "../user.router.js"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import {
    NOT_FOUND,
    ReasonPhrases,
    StatusCodes,
    getReasonPhrase,
    getStatusCode,
} from 'http-status-codes';
import crypto from 'crypto'
import * as validators from "../validationn.js"


export const updateuser=asyncHandler(
    async (req,res,next)=>{
        
        const{age,phone,userName}=req.body
        const validationResult=validators.updateuser.validate(req.body,{abortEarly:false});
        if(validationResult.error){
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "Validation Error", validationError: validationResult.error.details });
        }
        const check=await userModel.findOneAndUpdate({$and: [
            { _id:req.user._id },
            { is_online: "true" }
          ]},{...(age && { age }),...(phone && { phone }),...(userName && {userName})},{new:true})
        console.log(req.user._id)
        if(!check){
            return next(new Error("no user found wih this id"),{cause:StatusCodes.NOT_FOUND})
        }
           return res.status(StatusCodes.OK).json({message:"done",check})
    
    })

export const deleteuser=asyncHandler(
    async(req,res,next)=>{
        // console.log(req.headers.authorization)
        // const decoded=jwt.verify(req.headers.authorization,"bshmohandsanashwaelBaBa")
        // console.log(decoded)
         //const user=await userModel.findByIdAndDelete({_id:req.user._id})
         const user=await userModel.findOneAndDelete({$and: [
            { _id:req.user._id },
            { is_online: "true" }
          ]})
        if(!user){
            return next(new Error("no such id or log_in first "),{cause:StatusCodes.NOT_FOUND})
        }
        return res.status(StatusCodes.OK).json({message:"Done user deleted",user})

    }
)
export const softdelete=asyncHandler(
    async(req,res,next)=>{
        const user=await userModel.find({$and: [
            { _id:req.user._id },
            { is_online: "true" }
          ]})
        if(!user){
            return next (new Error("No such id like this"),{cause:StatusCodes.NOT_FOUND})
        }
        user.is_deleted=true
        await user.save()
        return res.status(StatusCodes.OK).json({message:"Done",user})
    }
    
)
export const updatepassword=asyncHandler(
    async (req,res,next)=>{
        const{oldpassword,newpassword}=req.body
        console.log({oldpassword,newpassword})
        console.log({ oldpassword, hashpassword: req.user.password })
        const validationResult=validators.updatepassword.validate(req.body,{abortEarly:false});
        if(validationResult.error){
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "Validation Error", validationError: validationResult.error.details });
        }
        const passwordMatch = await bcrypt.compare(oldpassword, req.user.password);
        console.log(passwordMatch)
        if (!passwordMatch) {
            return next(new Error("password not match ", { cause: StatusCodes.NOT_FOUND }))
        }
        const hashpassword = await bcrypt.hash(newpassword, 8)
        console.log(hashpassword)
        const user=await userModel.findOneAndUpdate({$and: [
            { _id:req.user._id },
            { is_online: "true" }
          ]},{password:hashpassword},{new:true})
        if(!user){
            return next (new Error("No such id like this or log_in first"),{cause:StatusCodes.NOT_FOUND})
        }
        return res.status(StatusCodes.OK).json({message:"doone",user})


    }
)
export const getUserData = asyncHandler(
    async (req, res, next) => {
        const user = await userModel.findById({_id:req.user._id});
  
        if (!user) {
          return res.status(StatusCodes.NOT_FOUND).json({ message: 'User not found' });
        }
  
        // Decrypt the phone number
        const secretKey = 'YourSecretKey'; // Replace with your secret key
        const decipher = crypto.createDecipher('aes-256-cbc', secretKey);
        let decryptedPhone = decipher.update(user.phone, 'hex', 'utf8');
        decryptedPhone += decipher.final('utf8');
  
        const userData = { ...user.toObject(), phone: decryptedPhone };
  
        return res.status(StatusCodes.OK).json({ message: 'User data retrieved', user: userData });
      }
  );
   