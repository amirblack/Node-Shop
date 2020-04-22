const User = require('app/models/User')
const middleWare = require('./middleware')

class redirectifadmin extends middleWare {
    handle(req, res, next) {
        if (req.isAuthenticated() && req.user.admin){
        return next()
        }
        return res.redirect('/')
    }
}

module.exports = new redirectifadmin();