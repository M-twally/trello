import { auth } from "../../middleware/auth.js";
import router from "../auth/auth.router.js";
import * as taskcontroller from "../tasks/controller/tasks.js"
import { Router } from "express";


router.post("/addtask",auth,taskcontroller.add_task)
router.get("/getalltaskdetails",taskcontroller.getalltaskswithuser)
router.get("/getusertask",auth,taskcontroller.getusertask)
router.put("/updatetask",auth,taskcontroller.updatetask)
router.delete("/deletetask",auth,taskcontroller.deletetask)
router.get("/getalltaskwithoutlogin",taskcontroller.getalltaskswithoutlogin)




export default router