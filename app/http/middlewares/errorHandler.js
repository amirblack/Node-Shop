
class errorHandler{
   async error404(req,res,next){
       try {
           res.statusCode = 404;
           res.locals.layout = 'errors/master'
           return res.render('errors/404',{
               message:'چنین صفحه ای یافت نشد!'
           })
       } catch (err) {
           
           next(err)
       }
   }
   async handler(err,req,res,next){
    const statusCode = err.status || 500;
    const stack = err.stack || '';
    const message = err.message || '';
    
    const layouts = {
        layout:'errors/master',
        extractScripts:false,
        extractStyles:false
    }
if(config.debug) return res.render('errors/stack' , { ...layouts , message , stack});
    if(statusCode == '404'){
        return res.render(`errors/${statusCode}`,{
            ...layouts,message:'صفحه مورد نظر یافت نشد! لطفا به صفحه اصلی برگردید.'
        })
    }
    return res.render(`errors/${statusCode}`,{...layouts,message:'مشکلی در سرور رخ داده لطفا به صفحه اصلی برگردید!',stack})
   }
}
module.exports = new errorHandler()