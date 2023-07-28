import { Schema,model } from "mongoose";

//( userName , email , password hashed , age , gender , phone)//is online & is deleted
const userschema=new Schema({
    userName:{
        type:String,
        required:true,
        unique:true
    
    },
    confirmEmail:{
        type:String,
        required:true,
        default:false,
    
    },
    is_online:{
    type:String,
    default:false,
    required:true,
    },
    is_deleted:{
        type:String,
        default:false,
        required:true,

    },
    email:{
        type:String,
        required:true,
        unique:true,
        Lowercase:true
    },
    password:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        required:true,
        unique:true
    },
    age:Number,
    gender:{//Male&Female only by enum
        type:String,
        required:true,
        enum:["Male","Female"]
    },

},{
    timestamps:true
})
const userModel=model("User",userschema)
export default userModel