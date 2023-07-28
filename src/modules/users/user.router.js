import router from "../auth/auth.router.js";
import * as usercontroller from "../users/controller/user.js"
import { Router } from "express";
import {auth} from "../../middleware/auth.js";
import { v_alidation } from "../../middleware/validation.js";
import * as vschema  from "./validationn.js";



//router.get("/profile",usercontroller.getprofile)
router.put("/update",v_alidation(vschema.updateuser),auth,usercontroller.updateuser)
router.delete("/delete",auth,usercontroller.deleteuser)
router.patch("/updatePass",auth,usercontroller.updatepassword)
router.get("/getuserdata",auth,usercontroller.getUserData)





export default router