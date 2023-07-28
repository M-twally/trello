import joi from "joi"
const objectId = (value, helpers) => {
  if (!value.match(/^[0-9a-fA-F]{24}$/)) {
  return helpers.error('any.invalid');
  }
  return value;
};
export const add_task=joi.object({
    //const{title , description , status , userId , assignTo , deadline}=req.body
    title:joi.string().min(3).max(30).required(),
    description:joi.string().min(3).max(30).required(),
    status:joi.string().valid('toDo', 'doing' , 'done').required(),
    userId:joi.string().custom(objectId,'object id validation').required(),
    assignTo:joi.string().required(),
    deadline: joi.date().greater('now').required(),

}).required()


  export const getalltaskswithoutlogin=joi.object({
    userId:joi.string().custom(objectId,'object id validation').required(),
  })
  export const deletetask=joi.object({
    taskId:joi.string().custom(objectId,'object id validation').required(),
  })
  export const updatetask=joi.object({
    status:joi.string().valid('toDo', 'doing' , 'done').required(),
    title:joi.string().min(3).max(30).required(),
    assignTo:joi.string().required(),
    description:joi.string().min(3).max(30).required(),

  }).required().xor('title', 'status', 'assignTo','description')