import mongoose from "mongoose";


const connectDB=async ()=>{
   return await mongoose.connect(process.env.DB_URL).then(result=>{
    console.log(`DB connected`)
    //console.log(result)
}).catch(err=>{
    console.log(`failedd to connect `)
    console.log(err)
})
}
export default connectDB