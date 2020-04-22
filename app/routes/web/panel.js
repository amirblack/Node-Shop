const express = require('express');
const router = express.Router();
const csrf = require('csurf')
//Middlewares
const redirectifAuth = require('app/http/middlewares/redirectifAuth')

//Validator
const panelValidator = require('app/validator/panelValidator')
//Controllers
const panelController = require('app/http/controllers/panelController')
//csurfProtection
const csrfProtection = csrf({ cookie: true });
const csrfHandler = require('app/http/middlewares/csrfHandler')


router.use((req,res,next)=>{
    res.locals.layout = 'panel/master';
    next()
})

router.use(redirectifAuth.handle)
router.get('/',csrfProtection,panelController.index);
router.post('/editdata',csrfProtection,panelValidator.handler(),panelController.editdata);
router.post('/changepassword',csrfProtection,panelValidator.handle(),panelController.changepassword)




router.use(csrfHandler.handler)
module.exports = router;