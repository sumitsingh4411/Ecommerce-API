const user = require("../../modal/user");
const ErrorHandler = require("../../service/ErrorHandler");
const Mydata={
    async me(req,res,next)
    {
          try
          {
              const User=await user.findOne({_id:req.User._id});
              
              if(!User)
              {
                  return next(ErrorHandler.notfound('not found'));
              }
              return res.json({User});
          }
          catch(err)
          {
              return next(err);
          }
    }
}

module.exports=Mydata;