const middleWare = require('./middleware')

class redirectifAuth extends middleWare {
    handle(req, res, next) {
        if ( ! req.isAuthenticated()) return res.redirect('/')
        next()
    }
}

module.exports = new redirectifAuth();