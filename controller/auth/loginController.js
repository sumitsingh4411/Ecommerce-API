const Joi = require("joi");
const user = require("../../modal/user");
const ErrorHandler = require("../../service/ErrorHandler");
const bcrypt = require('bcrypt');
const JwtToken = require("../../service/JwtToken");
const refreshToken = require("../../modal/refreshToken");
const loginController = {
    async login(req, res, next) {
        const loginSchema = Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
        })

        const { error } = loginSchema.validate(req.body);
        if (error)
            return next(error);


        try {
            const User = await user.findOne({ email: req.body.email });
            if (!User) {
                return next(ErrorHandler.wrongcreadintials('user name or password is wrong'))
            }
            const match = await bcrypt.compare(req.body.password, User.password);
            if (!match) {
                return next(ErrorHandler.wrongcreadintials('user name or password is wrong'))
            }
            const accesstoken = JwtToken.sign({ _id: User._id, role: User.role });


            const refrestoken = JwtToken.sign({ _id: User._id, role: User.role }, '1y', process.env.refresshsec);

            await refreshToken.create({ token: refrestoken })
            res.json({ access_token: accesstoken, refresh_token: refrestoken });
        }
        catch (err) {
            return next(err);
        }

    },
    async logout(req, res, next) {
        try {
            const refreshSchema = Joi.object({
                refresh_token: Joi.string().required(),
            })

            const { error } = refreshSchema.validate(req.body);
            if (error)
                return next(error);
            await refreshToken.deleteOne({ token: req.body.refresh_token });
            res.json({msg:'user logout'})

        } catch (error) {
            return next(new Error('something went wrong in database', error));
        }
    }
}

module.exports = loginController;