import userModel from "../../../../DB/models/user.model.js"
import { asyncHandler } from "../../../utils/errror.handling.js"
import router from "../auth.router.js"
import bcrypt from "bcrypt"
import  Jwt  from "jsonwebtoken"
import {
    NOT_FOUND,
    ReasonPhrases,
    StatusCodes,
    getReasonPhrase,
    getStatusCode,
} from 'http-status-codes';
import crypto from 'crypto'
import sendemail from"../../../utils/email.js"
import * as validators from "../validationn.js"


//( userName , email , password hashed , age , gender , phone)
export const signUp = asyncHandler(
    async (req, res, next) => {
        const { userName, email, password, age, gender, phone,is_online,is_deleted } = req.body
        console.log({ userName, email, password, age, gender, phone,is_online,is_deleted })
        const validationResult=validators.signUp.validate(req.body,{abortEarly:false});
        if(validationResult.error){
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "Validation Error", validationError: validationResult.error.details });
        }
        
        const check = await userModel.findOne({ email })
        if (check) {
            return next(new Error("Email Exists", { cause: StatusCodes.CONFLICT }))
        }
        const hashpassword = await bcrypt.hash(password, parseInt(process.env.SALT_ROUND))
        const secretKey = 'YourSecretKey'; // Replace with your secret key
    const cipher = crypto.createCipher('aes-256-cbc', secretKey);
    let encryptedPhone = cipher.update(phone, 'utf8', 'hex');
    encryptedPhone += cipher.final('hex');

       const user = await userModel.create({ userName, email, password: hashpassword, age, gender, phone:encryptedPhone})
       const token=Jwt.sign({id:user._id,email:user.email},process.env.EMAIL_SIGNATURE)
       const rftoken=Jwt.sign({id:user._id,email:user.email},process.env.EMAIL_SIGNATURE)
       const link=`http://localhost:5000/auth/confirmEmail/${token}`
       const rflink=`http://localhost:5000/auth/confirmEmail/again${rftoken}`
       await sendemail({
        to:email,
        subject:"confirm email",
        html:
        `<!DOCTYPE html>
                        <html>
                        <head>
                            <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"></head>
                        <style type="text/css">
                        body{background-color: #88BDBF;margin: 0px;}
                        </style>
                        <body style="margin:0px;"> 
                        <table border="0" width="50%" style="margin:auto;padding:30px;background-color: #F3F3F3;border:1px solid #630E2B;">
                        <tr>
                        <td>
                        <table border="0" width="100%">
                        <tr>
                        <td>
                        <h1>
                            <img width="100px" src="https://res.cloudinary.com/ddajommsw/image/upload/v1670702280/Group_35052_icaysu.png"/>
                        </h1>
                        </td>
                        <td>
                        <p style="text-align: right;"><a href="http://localhost:4200/#/" target="_blank" style="text-decoration: none;">View In Website</a></p>
                        </td>
                        </tr>
                        </table>
                        </td>
                        </tr>
                        <tr>
                        <td>
                        <table border="0" cellpadding="0" cellspacing="0" style="text-align:center;width:100%;background-color: #fff;">
                        <tr>
                        <td style="background-color:#630E2B;height:100px;font-size:50px;color:#fff;">
                        <img width="50px" height="50px" src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703716/Screenshot_1100_yne3vo.png">
                        </td>
                        </tr>
                        <tr>
                        <td>
                        <h1 style="padding-top:25px; color:#630E2B">Email Confirmation</h1>
                        </td>
                        </tr>
                        <tr>
                        <td>
                        <p style="padding:0px 100px;">
                        </p>
                        </td>
                        </tr>
                        <tr>
                        <td>
                        <a href="${link}" style="margin:10px 0px 30px 0px;border-radius:4px;padding:10px 20px;border: 0;color:#fff;background-color:#630E2B; ">Verify Email address</a>
                        </td>
                        </tr>
                        <tr>
                        <td>
                        <a href="${rflink}" style="margin:10px 0px 30px 0px;border-radius:4px;padding:10px 20px;border: 0;color:#fff;background-color:#630E2B; ">re_send</a>
                        </td>
                        </tr>
                        </table>
                        </td>
                        </tr>
                        <tr>
                        <td>
                        <table border="0" width="100%" style="border-radius: 5px;text-align: center;">
                        <tr>
                        <td>
                        <h3 style="margin-top:10px; color:#000">Stay in touch</h3>
                        </td>
                        </tr>
                        <tr>
                        <td>
                        <div style="margin-top:20px;">
        
                        <a href="${process.env.facebookLink}" style="text-decoration: none;"><span class="twit" style="padding:10px 9px;color:#fff;border-radius:50%;">
                        <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group35062_erj5dx.png" width="50px" hight="50px"></span></a>
                        
                        <a href="${process.env.instegram}" style="text-decoration: none;"><span class="twit" style="padding:10px 9px;color:#fff;border-radius:50%;">
                        <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group35063_zottpo.png" width="50px" hight="50px"></span>
                        </a>
                        
                        <a href="${process.env.twitterLink}" style="text-decoration: none;"><span class="twit" style="padding:10px 9px;;color:#fff;border-radius:50%;">
                        <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group_35064_i8qtfd.png" width="50px" hight="50px"></span>
                        </a>
        
                        </div>
                        </td>
                        </tr>
                        </table>
                        </td>
                        </tr>
                        </table>
                        </body>
                        </html>`
        

       })
    return res.status(StatusCodes.CREATED).json({ message: "Done", user })
    }
    


)
export const login = asyncHandler(
    async (req, res, next) => {
        const { userName, email, phone, password, cpass} = req.body
        console.log({ userName, email, password, cpass, phone })
        const validationResult=validators.login.validate(req.body,{abortEarly:false});
        if(validationResult.error){
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "Validation Error", validationError: validationResult.error.details });
        }
        const user = await userModel.findOne({
            $or: [
                { email },
                { userName },
                { phone },
            ],
        })
        if (!user) {
            return next(new Error("Invalid email or User_name or phone please sign up first ", { cause: StatusCodes.NOT_FOUND }))
        }
        console.log({ password, hashpassword: user.password })
        const passwordMatch = await bcrypt.compare(password, user.password);
        console.log(passwordMatch)
        if (!passwordMatch) {
            return next(new Error("password not match ", { cause: StatusCodes.NOT_FOUND }))
        }
        user.is_online = true; // Update the isOnline field to true
        await user.save(); 
        const token = Jwt.sign({ name: user.userName, id: user._id, phone: user.phone, age: user.age }, process.env.TOKEN_SIGNATURE, { expiresIn: 60 * 30 })

        return res.status(StatusCodes.ACCEPTED).json({ message: "Sucssefully log in ", token })
    }
)
export const logout=asyncHandler( 
    async(req,res,next)=>{
        /*const {is_online}=req.body
        const user=await userModel.findByIdAndUpdate(req.user._id,{is_online},{new:true})
        if(!user){
            return next (new Error("No such id like this"))
        }
        return res.json({message:"Done",user})*/
        const user=await userModel.findByIdAndUpdate(req.user._id)
        if(!user){
            return next (new Error("No such id like this"))
        }
        user.is_online=false
        await user.save()
        return res.status(StatusCodes.OK).json({message:"Done",user})
    }

)
 export const confirmEmail=asyncHandler(
    async (req,res,next)=>{
        const {token}=req.params
        console.log(token)
        const decoded=Jwt.verify(token,process.env.EMAIL_SIGNATURE)
        console.log(decoded)
        const user=await userModel.updateOne({_id:decoded.id},{confirmEmail:true})
       if (user.modifiedCount==0){
        //return res.redirect(`http://localhost:5000/auth/signUp`)
        return next (new Error("not registered yet please register first"))
       }
       //return res.redirect(`http://localhost:5000/auth/login`)
       return res.json({message:"done",user})
    }
 )

 export const confirmEmailagain=asyncHandler(
     async (req,res,next)=>{
         const {token}=req.params
         console.log(token)
         const decoded=Jwt.verify(token,process.env.EMAIL_SIGNATURE)
         console.log(decoded)
         const user=await userModel.findById({_id:decoded.id})
        if (!user){
         //return res.redirect(`http://localhost:5000/auth/signUp`)
         return next (new Error("not registered yet please register first"))
        }
        if(user.confirmEmail){
        //return res.redirect(`http://localhost:5000/auth/login`)
        return res.json({message:"already confirmed  log in ",user})
     }
     const newtoken=Jwt.sign({id:user._id,email:user.email},process.env.EMAIL_SIGNATURE,{expiresIn:60*20})
     const link=`http://localhost:5000/auth/confirmEmail/${newtoken}`
     await sendemail({
        to:email,
        subject:"confirm email",
        html: `<!DOCTYPE html>
        <html>
        <head>
            <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"></head>
        <style type="text/css">
        body{background-color: #88BDBF;margin: 0px;}
        </style>
        <body style="margin:0px;"> 
        <table border="0" width="50%" style="margin:auto;padding:30px;background-color: #F3F3F3;border:1px solid #630E2B;">
        <tr>
        <td>
        <table border="0" width="100%">
        <tr>
        <td>
        <h1>
            <img width="100px" src="https://res.cloudinary.com/ddajommsw/image/upload/v1670702280/Group_35052_icaysu.png"/>
        </h1>
        </td>
        <td>
        <p style="text-align: right;"><a href="http://localhost:4200/#/" target="_blank" style="text-decoration: none;">View In Website</a></p>
        </td>
        </tr>
        </table>
        </td>
        </tr>
        <tr>
        <td>
        <table border="0" cellpadding="0" cellspacing="0" style="text-align:center;width:100%;background-color: #fff;">
        <tr>
        <td style="background-color:#630E2B;height:100px;font-size:50px;color:#fff;">
        <img width="50px" height="50px" src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703716/Screenshot_1100_yne3vo.png">
        </td>
        </tr>
        <tr>
        <td>
        <h1 style="padding-top:25px; color:#630E2B">Email Confirmation</h1>
        </td>
        </tr>
        <tr>
        <td>
        <p style="padding:0px 100px;">
        </p>
        </td>
        </tr>
        <tr>
        <td>
        <a href="${link}" style="margin:10px 0px 30px 0px;border-radius:4px;padding:10px 20px;border: 0;color:#fff;background-color:#630E2B; ">Verify Email address</a>
        </td>
        </tr>
        <tr>
        <td>
        <a href="${rflink}" style="margin:10px 0px 30px 0px;border-radius:4px;padding:10px 20px;border: 0;color:#fff;background-color:#630E2B; ">re_send</a>
        </td>
        </tr>
        </table>
        </td>
        </tr>
        <tr>
        <td>
        <table border="0" width="100%" style="border-radius: 5px;text-align: center;">
        <tr>
        <td>
        <h3 style="margin-top:10px; color:#000">Stay in touch</h3>
        </td>
        </tr>
        <tr>
        <td>
        <div style="margin-top:20px;">

        <a href="${process.env.facebookLink}" style="text-decoration: none;"><span class="twit" style="padding:10px 9px;color:#fff;border-radius:50%;">
        <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group35062_erj5dx.png" width="50px" hight="50px"></span></a>
        
        <a href="${process.env.instegram}" style="text-decoration: none;"><span class="twit" style="padding:10px 9px;color:#fff;border-radius:50%;">
        <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group35063_zottpo.png" width="50px" hight="50px"></span>
        </a>
        
        <a href="${process.env.twitterLink}" style="text-decoration: none;"><span class="twit" style="padding:10px 9px;;color:#fff;border-radius:50%;">
        <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group_35064_i8qtfd.png" width="50px" hight="50px"></span>
        </a>

        </div>
        </td>
        </tr>
        </table>
        </td>
        </tr>
        </table>
        </body>
        </html>`,
     })
     return res.send(` doonecheck your email`)
    
}
)