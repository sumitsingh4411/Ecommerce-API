var jwt = require('jsonwebtoken');
class JwtToken {
    static sign(payload, expiry = '10h', secret = process.env.secret) {
        return jwt.sign(payload, secret, { expiresIn: expiry });
    }

    static veryfy(payload, secret = process.env.secret) {
        return jwt.verify(payload, secret);
    }
}
module.exports = JwtToken;