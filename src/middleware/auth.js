import userModel from "../../DB/models/user.model.js"
import { asyncHandler } from "../utils/errror.handling.js"
import  Jwt  from "jsonwebtoken"


export const auth=async(req,res,next)=>{
        try {
            const{authorization}=req.headers
        console.log(authorization)
        if(!authorization){
            return next(new Error("authentication is required",{cause:401}))
        }
        const decoded=Jwt.verify(req.headers.authorization,process.env.TOKEN_SIGNATURE)
        console.log(decoded)
        if(!decoded?.id){
            return next(new Error("Invalid token",{cause:400}))
        }
        const user=await userModel.findById(decoded.id)
        console.log(user)
        if(!user){
            return next(new Error("not register account",{cause:404}))
        }
        req.user=user
        return next()
            
        } catch (error) {
            return res.status(500).json({ message: error.message, stack: error.stack })
            
        }
    }
    

