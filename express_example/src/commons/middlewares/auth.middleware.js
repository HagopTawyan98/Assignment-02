const { Forbidden, Locked } = require('http-errors');
const { validateToken, isLocked } = require('../../auth/auth.service');
const users = require('../../users/users.service');

const jwtMiddleware = async (req, res, next) => {
    let token;
    try {
        token = req.header('Authorization').split(' ')[1];
        const user = validateToken(token);

        const dbUser = await users.findOne(user.userId);
        if (dbUser.locked){
            return next(new Locked());
        }
        user.role = dbUser.role;
        req.user = user;
    } catch (err) {
        return next(new Forbidden());
    }

    next();
}

jwtMiddleware.unless = require('express-unless');

module.exports = {
    jwtMiddleware
}