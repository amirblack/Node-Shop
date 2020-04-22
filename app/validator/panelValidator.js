const { check } = require('express-validator')
const validate = require('./validator')

class panelValidator extends validate{
        handle(){
            return [
            check('oldpassword').isLength({min:8}).trim().escape().withMessage('فیلد رمز عبور فعلی حداقل باید 8 کاراکتر باشد'),
            check('newpassword').isLength({min:8}).trim().escape().withMessage('فیلد رمز عبور جدید حداقل باید 8 کاراکتر باشد'),
            check('reppassword')
                .isLength({min:8})
                .trim().escape()
                .withMessage('فیلد تکرار رمز عبور حداقل باید 8 کاراکتر باشد')
                .custom(async (value,{req})=>{
                if(value !== req.body.newpassword){
                    throw new Error('رمزعبورها باهم برابر نیستند!')
                }
                }),
            ]
        }
        handler(){
        return [
            check('name').not().isEmpty().trim().escape().withMessage('فیلد نام و نام خانوادگی مشکلی دارد!')
        ]
    }
}
module.exports = new panelValidator()