const Joi = require("joi");
const user = require("../../modal/user");
const refreshToken = require("../../modal/refreshToken");
const ErrorHandler = require("../../service/ErrorHandler");
const bcrypt = require('bcrypt');
const JwtToken = require("../../service/JwtToken");

const RegisterController = {
    async register(req, res, next) {

        const registerSchema = Joi.object({
            name: Joi.string().min(3).max(30).required(),
            email: Joi.string().email().required(),
            password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
            repeat_pass: Joi.ref('password')
        })

        const { error } = registerSchema.validate(req.body);
        if (error)
            return next(error);

        try {
            const exist = await user.exists({ email: req.body.email });
            if (exist) {
                return next(ErrorHandler.alreadyExist('this email is already taken'));
            }
        } catch (err) {
            return next(err);
        }

        const hashpassword = await bcrypt.hash(req.body.password, 10);
        const { name, email } = req.body;

        const User = new user({
            name,
            email,
            password: hashpassword
        });
        let accesstoken = '';
        let refrestoken ='';
        try {
            const saveuser =await User.save();
            console.log(saveuser);
            accesstoken = JwtToken.sign({ _id: saveuser._id, role: saveuser.role });
            refrestoken = JwtToken.sign({ _id: saveuser._id, role: saveuser.role },'1y',process.env.refresshsec);

           await refreshToken.create({token:refrestoken})
        }
        catch (err) {
            return next(err);
        }
        res.json({ access_token:accesstoken , refresh_token:refrestoken})
    }
}

module.exports = RegisterController;