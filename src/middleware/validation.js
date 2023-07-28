const dataMethods=['body','params','query','headers','file']

export const v_alidation=(vSchema)=>{
    return (req,res,next)=>{
        const validationResult=vSchema.validate({...req.body,...req.params,...req.query},{abortEarly:false});
        if(validationResult.error){
            return res.json({
                message:"validation Error",
                validationError:validationResult.error.details
            })
        }
        return next()
    }
}
// export const v_alidation=(vSchema)=>{
//     return (req,res,next)=>{
//         const validationerror=[]
//         dataMethods.forEach( key=>{
            
//             if(vSchema[key]){
//             const validationResult=vSchema[key].validate(req[key],{abortEarly:false});
//             }
//             if(validationerror.error){
//                 validationerror.push(validationerror.error.details)
//             }
//         });
//         if(validationerror.length){
//             return res.json({message:"validation Error ",validationerror})
//         }
        
//         return next()
//     }
// }

