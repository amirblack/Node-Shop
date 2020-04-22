const User = require('app/models/User')
const middleWare = require('./middleware')

class RememberLogin extends middleWare {
    handle(req, res, next) {
        if (!req.isAuthenticated()) {
            const rememberToken = req.signedCookies.remember_token;
            if (rememberToken) return this.rememberMe(rememberToken, req, next)
        }
        next();
    }
    rememberMe(rememberToken, req, next) {
        User.findOne({
                rememberToken
            })
            .then(user => {
                //Check User if true is created rememberToken
                if (user) {
                    req.logIn(user, err => {
                        if (err) next(err)
                        next()
                    })
                } else
                    next()

            })
            .catch(err => next(err))
    }
}

module.exports = new RememberLogin();