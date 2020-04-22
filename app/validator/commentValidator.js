const {check} = require('express-validator');
const validate = require('./validator')
class commentValidator extends validate {

    handle() {
        return [
            check('comment')
                .isLength({min:4})
                .trim()
                .escape()
                .withMessage('فیلد کامنت مشکلی دارد'),
            check('name')
                .custom(async (value,{req})=>{
                    if(req.isAuthenticated()) return;
                    if(! value){
                        throw new Error('فیلد نام مشکلی دارد')
                    }
                    await sanitize('name').escape().trim()
                }),

            check('email')
                .custom(async (value,{req})=>{
                    if(req.isAuthenticated()) return;
                    if(! value){
                        throw new Error('ایمیل وارد شده مشکلی دارد')
                    }
                    await sanitize('email').escape().trim()
                })

            
                ]
    }
}

module.exports = new commentValidator()