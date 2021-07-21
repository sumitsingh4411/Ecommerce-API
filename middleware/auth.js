const ErrorHandler = require("../service/ErrorHandler");
const JwtToken = require("../service/JwtToken");

const auth = async (req, res, next) => {
    let authheader = req.headers.authorization;

    if (!authheader)
        return next(ErrorHandler.Aunauthroize('unAuthorize'));

    const token = authheader.split(' ')[1];
    try {
        const { _id, role } = await JwtToken.veryfy(token);
        req.User = {};
        req.User._id = _id;
        req.User.role = role;
        next();
    } 
    catch (err) {
        return next(ErrorHandler.Aunauthroize());
    }

}
module.exports = auth;