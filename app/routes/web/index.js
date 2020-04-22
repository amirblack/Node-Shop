const express = require('express');
const router = express.Router();
//Middlewares
const errorHandler = require('app/http/middlewares/errorHandler')
//Home

const home = require('app/routes/web/home');
router.use('/',home)
//Admin
const admin = require('app/routes/web/admin');
router.use('/admin',admin)
//auth
const auth = require('app/routes/web/auth/index');
router.use('/auth',auth);
//panel
const panel = require('app/routes/web/panel')
router.use('/panel',panel);

router.all('*' , errorHandler.error404);
router.use(errorHandler.handler)

module.exports = router;