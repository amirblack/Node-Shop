const middleWare = require('./middleware')

class actUser extends middleWare {
    handle(req, res, next) {
        if (req.isAuthenticated()){
            if(req.user.active) return next()
            this.alertMessage(req,{
                title:'دقت کنید',
                message:'حساب کاربری شما فعال نیست لطفا به فرم ورود مراجعه نمایید',
                timer:null,
                button:true,
                type:'warning',
            })
            req.logout();
            res.clearCookie('remember_token')
            res.redirect('/')
        }
        else{
        next()
        }
        
    }
    alertMessage(req,data){
        let title = data.title;
        let message = data.message;
        let timer = data.timer;
        let type = data.type;
        let button = data.button;
        req.flash('sweetalert',{
            title,
            message,
            timer,
            type,
            button,
        })
    }
}

module.exports = new actUser();