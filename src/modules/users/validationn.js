import joi from 'joi'
export const updateuser=joi.object({
    phone: joi.string().pattern(/^[0-9]{10}$/).allow('').optional(),
    userName: joi.string().allow('').optional(),
    age:joi.number().integer().positive().required(),

}).required().xor('email', 'phone', 'userName','age')
         
export const updatepassword=joi.object({
    oldpassword:joi.string().pattern(
        new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)).required(),
    newpassword:joi.string().pattern(
        new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)).required(),
}).required()
