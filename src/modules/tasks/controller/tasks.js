

import { StatusCodes } from "http-status-codes"
import taskmodel from "../../../../DB/models/tsak.model.js"
import userModel from "../../../../DB/models/user.model.js"
import { asyncHandler } from "../../../utils/errror.handling.js"
import router from "../tasks.router.js"
import * as validators from "../validationn.js"
// {toDo , doing , done}
export const add_task=asyncHandler(
    async (req,res,next)=>{
        console.log(req.user)
        const{title , description , status , userId , assignTo , deadline}=req.body
        console.log({title , description , status , userId , assignTo , deadline})
        console.log(req.user._id)
        const validationResult=validators.add_task.validate(req.body,{abortEarly:false});
        if(validationResult.error){
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "Validation Error", validationError: validationResult.error.details });
        }
        const check=await userModel.find({$and: [
            { _id:userId },
            { is_online: "true" }
          ]})
        console.log(check)
        if(check.length==0){
            return next(new Error("no such user id with this"),{cause:StatusCodes.NOT_FOUND})
        }
        const task=await taskmodel.create({title , description , status:"toDo" , userId , assignTo , deadline})

        return res.status(StatusCodes.OK).json({message:"task added",task})
    }
    
)
export const getalltaskswithuser=asyncHandler(
    async (req,res,next)=>{
        const post= await taskmodel.find().populate([
            {
             path:"userId"
            }
         ])
         if(!post){
         return next (new Error("invalid_id"),{cause:StatusCodes.NOT_FOUND})
         }
         return res.status(StatusCodes.OK).json({message:"your list is here",post})
    
     }

)
export const getusertask=asyncHandler(
    async(req,res,next)=>{
        console.log(req.user)
        const post= await taskmodel.findOne({userId:req.user._id}).populate([
            {
             path:"userId"
            }
         ])
         if(!post){
         return next (new Error("no tasks for this user"),{cause:StatusCodes.NOT_FOUND})
         }
         return res.status(StatusCodes.OK).json({message:"your list is here",post})
    }
)
export const getalltaskswithoutlogin=asyncHandler(
    async(req,res,next)=>{
        const{userId}=req.body
        console.log({userId})
        const validationResult=validators.getalltaskswithoutlogin.validate(req.body,{abortEarly:false});
        if(validationResult.error){
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "Validation Error", validationError: validationResult.error.details });
        }
        const task=await taskmodel.find({
            userId:userId
            
        }).populate([
            {
             path:"userId"
            }
         ])
         if(task.length==0){
            return next(new Error ("no such tasks with this id"),{cause:StatusCodes.NOT_FOUND})
         }
         return res.status(StatusCodes.OK).json({message:"done",task})
    }
)
export const updatetask=asyncHandler(
    async (req,res,next)=>{
        console.log(req.user)
        const{assignTo,status,title,description}=req.body
        console.log(req.body)
        const validationResult=validators.updatetask.validate(req.body,{abortEarly:false});
        if(validationResult.error){
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "Validation Error", validationError: validationResult.error.details });
        }
        const task=await taskmodel.find({userId:req.user._id})
        if(task.length==0){
            return next (new Error(`No task asssigned to ${req.user.userName}`),{cause:StatusCodes.CONFLICT})
        }
        const take=await taskmodel.updateOne({userId:req.user._id},{...(assignTo && { assignTo }),...(status && { status }),...(title && {title}),...(description && 
            {description})},{new:true})
        if(!task){
            return next (new Error("error not the user id"),{cause:StatusCodes.NOT_FOUND})
        }
        return res.status(StatusCodes.OK).json({message:"dooone",take})

    }
)
export const deletetask=asyncHandler(
    async (req,res,next)=>{
        console.log(req.user)
        const{taskId}=req.body
        console.log({taskId})
        const validationResult=validators.deletetask.validate(req.body,{abortEarly:false});
        if(validationResult.error){
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "Validation Error", validationError: validationResult.error.details });
        }
        const task=await taskmodel.findOneAndDelete({$and: [
            { _id:taskId},
            { userId: req.user._id }
          ]})
          if(!task){
           return next (new Error(`wrong id or ${req.user.userName} is not the task owner`),{cause:StatusCodes.NOT_FOUND})
          }
          return res.status(StatusCodes.OK).json({message:"dooone",task})

    }
)
export const getlatetasks=asyncHandler(
    async (req,res,next)=>{
        console.log(req.user)
        const current_date=new Date()
        const task=await taskmodel.find({$and:[{userId:req.user._id},{deadline: { $lt: current_date }} ]})
        if(task.length==0){
            return next (new Error("no lated tasks found"),{cause:StatusCodes.NOT_FOUND})
        }
        return res.status(StatusCodes.OK).json({message:"done",task})
    }
)