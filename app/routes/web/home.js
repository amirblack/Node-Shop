const express = require('express');
const router = express.Router();
const csrf = require('csurf');
const rateLimit = require('express-rate-limit');
//Controller
const homeController = require('app/http/controllers/homeController');
const postController = require('app/http/controllers/postController');
const singleController = require('app/http/controllers/singleController');
//Validator
const commentValidator = require('app/validator/commentValidator')
//MiddleWares
//CsurfProtection
const csrfProtection = csrf({ cookie: true });
const csrfHandler = require('app/http/middlewares/csrfHandler')
const limiter = rateLimit({
    windowMs:60 * 60 * 1000 * 24,
    max:5,
    handler:function(req,res){
        res.locals.layout = 'errors/master'
        return res.render('errors/limiter',{
            title:'مشکل امنیتی',
            message:'شما تا 24 ساعت نمی توانید کامنتی ارسال کنید!'
        })
    }
})

router.get('/', homeController.index);

router.get('/search',homeController.search)
router.get('/exit', (req, res) => {
    
    req.logout();
    res.clearCookie('remember_token')
    res.redirect('/')
})
//sites-router
router.get('/login',(req,res)=>{
    res.redirect('/')
})
router.get('/signup',(req,res)=>{
    res.redirect('/')
})
router.get('/forget',(req,res)=>{
    res.redirect('/')
})
router.get('/posts',homeController.posts);
router.get('/posts/:post',csrfProtection,postController.index);
router.post('/posts/comment',limiter,csrfProtection,commentValidator.handle() , postController.comment);
router.get('/tags/:tag',homeController.tags);
router.get('/categories',homeController.categoriesall)
router.get('/categories/:category',homeController.categories);
router.get('/page',(req,res)=>{
    res.redirect('/')
})
router.get('/page/advertise',singleController.ads)
router.get('/page/faq',singleController.faq)
router.get('/page/copyright',singleController.copyright)
router.get('/page/aboutus',singleController.aboutus)
router.get('/tags',(req,res)=> res.redirect('/'))
//sitemap
router.get('/sitemap.xml',homeController.sitemap)


//Handle error!
router.use(csrfHandler.handler)

module.exports = router;