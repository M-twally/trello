
export const asyncHandler = (fun) => {
    return (req, res, next) => {
        fun(req, res, next).catch(err => {
            return next(new Error(err, { cause: 500 }))
        })
    }

}
export const globalEroorHandling = (error, req, res, next) => {
    return res.status(error.cause|| 500).json({ message: error.message, stack: error.stack })

}