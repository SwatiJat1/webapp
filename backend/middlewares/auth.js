const User=require('../models/user')
const ErrorHandler = require("../utils/errorHandler");

const catchAsyncErrors = require("./catchAsyncErrors");
const jwt=require('jsonwebtoken')

exports.isAuthenticatedUser=catchAsyncErrors(async(req,res,next)=>{
    const {token}=req.cookies

   if(!token){
       return next(new ErrorHandler('Login first to access this resources',401))
   }
   const decoded=jwt.verify(token,process.env.JWT_SECRET)
   const usr = await User.findById(decoded.id);
   req.user = usr

   next()
})
exports.authorizeRoles=(...roles)=>{
    return (req,res,next)=>{
        if(!roles.includes(req.user.role)){
            return next(
            new ErrorHandler(`Role (${req.user.role}) is not allow to access this resources`
            ,403))
        }
        next();
    }
}

