const User = require('../users/user.entity');
const { Unauthorized } = require('http-errors')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class AuthService {
    async validate(username, password) {
        const user = await User.findOne({ username });
        if(user.lockCheck && user){
            throw new Error('The user is locked!'); 
        }
        if (!user || !bcrypt.compareSync(password, user.password)) {
            if(user){
                let counter = user.loginAttempts + 1;
                user.loginAttempts = counter;

                if(counter >= 3){
                    user.lockCheck = true;
                }

                await user.save();

                if(user.lockCheck){
                    throw new Error('The user is locked!');
                }
            }
            throw new Unauthorized();
        }
        if(user.loginAttempts < 3){
            user.loginAttempts = 0;
        }
        await user.save();


        return user;
    }

    async login(username, password) {
        const user = await this.validate(username, password);

        const token = jwt.sign({ userId: user._id, username: user.username }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN
        })

        return token;
    }

    validateToken(token) {
        const obj = jwt.verify(token, process.env.JWT_SECRET, {
            ignoreExpiration: false
        })

        return { userId: obj.userId, username: obj.username };
    }

}

module.exports = new AuthService();