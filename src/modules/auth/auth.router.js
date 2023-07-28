import  * as authcontroller from "../auth/controller/auth.js"
import { Router } from "express";
import { auth } from "../../middleware/auth.js";
import { v_alidation } from "../../middleware/validation.js";
import * as vschema  from "./validationn.js";
import { Schema } from "mongoose";

const router=Router()
router.post("/signup",v_alidation(vschema.signUp),authcontroller.signUp)
//router.post("/signup",authcontroller.signUp)
router.get("/login",v_alidation(vschema.login),authcontroller.login)
router.get("/confirmEmail/:token",authcontroller.confirmEmail)
router.get("/confirmEmail/again",authcontroller.confirmEmailagain)
router.put("/logout",auth,authcontroller.logout)

export default router