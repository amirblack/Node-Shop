const {check} = require('express-validator');
const validate = require('./validator');
const User = require('app/models/User');
class validatorRegister extends validate{
    handle(){
        return[
            check('name')
                .not().isEmpty()
                .trim().escape()
                .withMessage('فیلد نام مشکلی دارد!'),
            check('email')
                .isEmail()
                .normalizeEmail()
                .withMessage('فیلد ایمیل مشکلی دارد!')
                .custom(async (value,{req})=>{
                    let data = await User.findOne({email:value});
                    if(data){
                        throw new Error('چنین کاربری وجود دارد!')
                    }

                    
                })
                ,
            check('password')
                .isLength({min:8})
                .trim().escape()
                .withMessage('رمز عبور مشکلی دارد'),
            check('passwordConfirm')
                .not().isEmpty()
                .trim().escape()
                .withMessage('فیلد تکرار رمزعبور مشکلی دارد!')
                .custom(async (value,{req})=>{
                if(value !== req.body.password){
                    throw new Error('رمز عبور با هم برابر نیستند!')
                }
                }),
        ]
    }
    
}

module.exports = new validatorRegister()