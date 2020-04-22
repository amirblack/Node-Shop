const middleWare = require('./middleware')

class redirectif extends middleWare {
    handle(req, res, next) {
        if (req.isAuthenticated()) return res.redirect('/')
        next()
    }
}

module.exports = new redirectif();