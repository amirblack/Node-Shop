const { check} = require('express-validator');

class validatorResPass{
    handle(){
        return[
            check('email')
                .isEmail()
                .normalizeEmail()
                .withMessage('این ایمیل نیست')
        ]
    }
}

module.exports = new validatorResPass()