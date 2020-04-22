const {check} = require('express-validator');
const validate = require('./validator')
class validatorLogin extends validate {

    handle() {
        return [
            check('email')
                .isEmail()
                .normalizeEmail()
                .withMessage('این ایمیل نیست!'),
            check('password')
                .isLength({min:8})
                .trim()
                .escape()
                .withMessage('رمز عبور وارد شده مشکلی دارد!')
        ]
    }
}

module.exports = new validatorLogin()