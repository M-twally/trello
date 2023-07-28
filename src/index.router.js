import usercontroller from "../src/modules/users/user.router.js"
import authcontroller from "../src/modules/auth/auth.router.js"
import taskcontroller from "../src/modules/tasks/tasks.router.js"
import connectDB from "../DB/connection.js"
import { globalEroorHandling } from "./utils/errror.handling.js"


 export const bootstrap=(app,express)=>{
    app.use(express.json())
     app.use("/user",usercontroller)
     app.use("/tasks",taskcontroller)
     app.use("/auth",authcontroller)
     app.use(globalEroorHandling)
    app.use("/*",(req,res,next)=>{
        return res.json({message:"in_valid routing"})
    
        })

    connectDB()
    
}
