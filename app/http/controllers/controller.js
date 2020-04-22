const autobind = require('auto-bind');
const Recaptcha = require('express-recaptcha').RecaptchaV2;
const config = require('./../../../config');
const {validationResult} = require('express-validator');
const isMongoId = require('validator/lib/isMongoId')
module.exports = class Controller {
    constructor() {
        autobind(this);
        this.recaptchConfig();
    }
    recaptchConfig() {
        this.recaptcha = new Recaptcha(config.service.clinet_key, config.service.secret_key, {
            ...config.service.options
        })
    }
     recaptchValidation(req , res) {
        return new Promise((resolve , reject) => {
            this.recaptcha.verify(req , (err , data) => {
                if(err) {
                    req.flash('errors' , 'گزینه امنیتی مربوط به شناسایی روبات خاموش است، لطفا از فعال بودن آن اطمینان حاصل نمایید و مجدد امتحان کنید');
                    return this.back(req,res)
                } else resolve(true)
                
            })
        })
    }
    async validationData(req) {
        const result =  validationResult(req)
        if (!result.isEmpty()) {
            const errors = result.array()
            const message = [];
            errors.forEach(err => message.push(err.msg))
            req.flash('errors',message)
        return false;
        }
        return true;
    }
    back(req,res){
        req.flash('formData',req.body)
        return res.redirect(req.header('Referer')|| '/')
    }
    isMongoId(paramId){
        if(!isMongoId(paramId)){
            this.error('چنین آیدی یافت نشد',404 )
        }
    }
    error(message,status=500){
        let err = new Error(message)
        err.status = status;
        
        throw err;
    }

     slug(value){
        return value.replace(/([^۰-۹آ-یa-zA-Z0-9]|-)+/g , "-")
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
    alertBack(req,res,data){
        this.alertMessage(req,data);
        this.back(req,res)
    }
}