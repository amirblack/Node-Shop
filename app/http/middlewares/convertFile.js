const middleWare = require('./middleware')

class convertFile extends middleWare {
    handle(req,res,next) {
        if(! req.file){
            req.body.images = undefined
        }
        else{
            req.body.images = req.file.originalname
        }
        next()
    }
   
}

module.exports = new convertFile();