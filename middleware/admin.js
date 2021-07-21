const user = require("../modal/user");
const ErrorHandler = require("../service/ErrorHandler");

const admin=async(req,res,next)=>{
 


    try {
        const User=await user.findOne({_id:req.User._id});
        if(User.role==='admin')
        {
             return next();
        }
        else
        return next(ErrorHandler.Aunauthroize());
    } catch (error) {
        return next(ErrorHandler.servererror());
    }
}

module.exports=admin;