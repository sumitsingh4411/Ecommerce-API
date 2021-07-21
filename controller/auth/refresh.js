const Joi = require("joi");
const refreshToken = require("../../modal/refreshToken");
const ErrorHandler = require("../../service/ErrorHandler");
const user = require("../../modal/user");
const JwtToken = require("../../service/JwtToken");

const refresh = {
    async refreshTToken(req, res, next) {
        const refreshSchema = Joi.object({
            refresh_token: Joi.string().required(),
        })

        const { error } = refreshSchema.validate(req.body);
        if (error)
            return next(error);
        let data = '';
        let UserId = '';
        try {
            data = await refreshToken.findOne({ token: req.body.refresh_token });
            if (!data) {
                return next(ErrorHandler.Aunauthroize('Invalide refresh token'));
            }

            try {
                const { _id } = JwtToken.veryfy(data.token, process.env.refresshsec);
                UserId = _id;


            } catch (error) {
                return next(ErrorHandler.Aunauthroize('Invalide refresh token'));
            }

            const User = await user.findOne({ _id: UserId });

            if (!User) {
                return next(ErrorHandler.Aunauthroize('user not found'));
            }

            const accesstoken = JwtToken.sign({ _id: User._id, role: User.role });


            const refrestoken = JwtToken.sign({ _id: User._id, role: User.role }, '1y', process.env.refresshsec);

            await refreshToken.create({ token: refrestoken })
            res.json({ access_token: accesstoken, refresh_token: refrestoken });

        } catch (error) {
            return next(new Error('something went wrong', error.message));
        }
    }
}

module.exports = refresh;