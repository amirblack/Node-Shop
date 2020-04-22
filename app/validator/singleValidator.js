const {check} = require('express-validator');
const Single = require('app/models/Single')
const validate = require('app/validator/validator')
const path = require('path')
class categoryValidator extends validate{


    handle() {
        return [
            check('title')
                .not().isEmpty()
                .withMessage('نباید تیتر خالی باشد!')
                .custom(async (value,{req})=>{
                    if(req.query._method === 'put') return;
                    let data = await Single.findOne({title:value});
                    if(data){
                        throw new Error('چنین تیتری وجود دارد!')
                    }

                    
                }),
            check('slug')
                .not().isEmpty()
                .withMessage('اسلاگ نباید خالی باشد!'),
            check('body')
                .not().isEmpty()
                .withMessage(' متن نباید خالی باشد!'),
            check('color')
                .isHexColor()
                .withMessage('رنگ را درست انتخاب کنید!')
                ,
            check('images')
                .custom(async (value,{req})=>{
                    if(req.query._method === 'put') return;
                    if(! value){
                        throw new Error('تصویری ارسال نکردید!')}
                    let fileExt = ['.png','.jpg','.jpeg','.svg']
                    if(! fileExt.includes(path.extname(value))){
                        throw new Error('پسوند تصویر اشتباه می باشد!')
                        }
                })
        ]
    }
     
}

module.exports = new categoryValidator()