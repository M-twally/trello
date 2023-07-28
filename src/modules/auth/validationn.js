import joi from 'joi'
export const signUp=joi.object({
    //const { userName, email, password, age, gender, phone,is_online,is_deleted } = req.body
    userName: joi.string().min(3).max(30).required(),
    email:joi.string().email({minDomainSegments :1,maxDomainSegments:3,tlds:{allow:['com','edu']}}).required(),
    password:joi.string().pattern(
        new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)
    ).required(),
    cpass:joi.string().valid(joi.ref("password")).required(),
    age:joi.number().integer().positive().required(),
    gender:joi.string().valid('Male', 'Female').required(),
    phone:joi.string().pattern(/^\d{10,11}$/).required(),
    
    
    
    

}).required()

export const login=joi.object({
        email: joi.string().email().allow('').optional(),
        phone: joi.string().pattern(/^[0-9]{10}$/).allow('').optional(),
        userName: joi.string().allow('').optional(),
        password: joi.string().required(),
        
      }).required().xor('email', 'phone', 'userName')
        .with('userName', ['password'])
        .with('email', ['password'])
        .with('phone', ['password'])
        .required()
    
   // export const signUp={
//     body:joi.object({
//         //const { userName, email, password, age, gender, phone,is_online,is_deleted } 
//     userName:joi.string().alphanum().required,
//     email:joi.string().email({minDomainSegments :1,maxDomainSegments:3,tlds:{allow:['com','edu']}}).required(),
//     password:joi.string().pattern(
//         new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)
//     ).min(8).max(12).required(),
//     cpass:joi.string().valid(joi.ref("password")).required(),
//     age:joi.number().integer().positive().required(),
//     gender:joi.string().valid('Male', 'Female').required(),
//     phone:joi.number().min(11).max(11),

// }).required(),
// }

// export const login={
//     //const { userName, email, phone, password, cpass}
//     body:joi.object({
//         email: joi.string().email().allow('').optional(),
//         phone: joi.string().pattern(/^[0-9]{10}$/).allow('').optional(),
//         userName: joi.string().allow('').optional(),
//         password: joi.string().required(),
//         cpass: joi.string().valid(joi.ref('password')).required()
//       }).xor('email', 'phone', 'userName')
//         .with('userName', ['password', 'cpass'])
//         .with('email', ['password', 'cpass'])
//         .with('phone', ['password', 'cpass'])
//         .required(),
    
//     } 