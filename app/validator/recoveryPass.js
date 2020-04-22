const {check} = require('express-validator');

class recoveryPassValidtor {
    handle(){
        return [

            check('email')
                .isEmail()
                .normalizeEmail()
                .withMessage('این ایمیل نیست!'),
            check('password')
                .isLength({min:8})
                .trim().escape()
                .withMessage('رمز عبور مشکلی دارد')
            ]
        
    }
}

module.exports = new recoveryPassValidtor()