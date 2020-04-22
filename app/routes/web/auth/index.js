const express = require('express');
const router = express.Router();
const csrf = require('csurf');
const rateLimit = require('express-rate-limit');
//Controllers
const authController = require('app/http/controllers/auth/authController');
const recoveryPassController = require('app/http/controllers/auth/recoveryPassController');
const passwordResetController = require('app/http/controllers/auth/passwordResetController');
//Middlewares
const redirectif = require('app/http/middlewares/redirectif');
const validatorRegister = require('app/validator/validatorRegister');
const validatorLogin = require('app/validator/validatorLogin');
const passwordResPass = require('app/validator/validatorResPass');
const recoveryPassValidtor = require('app/validator/recoveryPass');
const passport = require('passport')

//csurfProtction
const csrfProtection = csrf({ cookie: true });
const csrfHandler = require('app/http/middlewares/csrfHandler')


const limiter = rateLimit({
    windowMs:60 * 60 * 1000,
    max:10,
    handler:function(req,res){
        res.locals.layout = 'errors/master'
        return res.render('errors/limiter',{
            title:'مشکل امنیتی',
            message:'درخواست شما بسیار زیاد بوده! لطفا یک ساعت دیگر دوباره تلاش کنید.'
        })
    }
})
router.use((req,res,next)=>{
    res.locals.layout = 'auth/master';
    next()
});
router.get('/forget/:token',csrfProtection,recoveryPassController.showForm)
router.post('/reset',csrfProtection,passwordResPass.handle(),passwordResetController.passwordResetProcess)
router.use(redirectif.handle)

//passwordReset
router.get('/forget',csrfProtection,passwordResetController.showForm);

router.get('/signup',authController.register)
router.post('/signup',limiter,validatorRegister.handle(),authController.registerProccess)
router.get('/login',csrfProtection,authController.login);
router.post('/login',limiter,csrfProtection,validatorLogin.handle(),authController.loginProccess)

router.post('/reset/email',csrfProtection,recoveryPassValidtor.handle(),recoveryPassController.recoveryPassControllerProccess)

router.get('/activeuser/:token',authController.active)
// router.get('/google',passport.authenticate('google',{scope:['profile','email']}))
// router.get('/get/google',passport.authenticate('google',{failureRedirect:'/auth/login',successRedirect:'/'}))

router.use(csrfHandler.handler)
module.exports = router;

