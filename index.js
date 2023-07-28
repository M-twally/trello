import dotenv from "dotenv"
dotenv.config()

import express from "express"
import { bootstrap } from "./src/index.router.js"
import send_Email from "./src/utils/email.js"
const app=express()
//send_Email()
const port=5000

bootstrap(app,express)
app.listen(port,()=>{
    console.log(`server is running on ${port}`)
})