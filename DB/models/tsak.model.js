import { Schema,model,Types } from "mongoose";


//(title , description , status{toDo , doing , done} , userId , assignTo , deadline)
const taskschema=new Schema({
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    userId:{
        type:Types.ObjectId,
        ref:"User",
        required:true
    },
    status:{
        type:String,
        required:true,
        enum:["toDo", "doing" , "done"]

    },
    assignTo:{
        type:String,
        required:true,
    },
    deadline:{
        type:Date,
        required:true,
        validate: {
            validator: function(value) {
              return value >= new Date(); // Check if the deadline is not expired
            },
            message: 'Deadline must be a future date/time'
          }
        
    }

},
{
    timestamps:true
})
const taskmodel=model("task",taskschema)
export default (taskmodel)