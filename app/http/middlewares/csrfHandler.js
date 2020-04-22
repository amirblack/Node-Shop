  
class csrfHandler{

   async handler(err,req,res,next){
        if (err.code !== 'EBADCSRFTOKEN') return next(err)
        
        res.status(403)
        res.locals.layout = 'errors/master'
        if(config.debug) return res.render('errors/403',{ message : err.message })
        return res.render('errors/403',{ message : 'شما دسترسی به این بخش ندارید!'})
   }
}
module.exports = new csrfHandler()
  
  
