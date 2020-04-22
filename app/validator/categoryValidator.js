const {check} = require('express-validator');
const Category = require('app/models/Category')
const validate = require('app/validator/validator')
const path = require('path')
class categoryValidator extends validate{


    handle() {
        return [
            check('name')
                .not().isEmpty()
                .withMessage('دسته نباید خالی باشد!')
                ,
            check('slug')
                .not().isEmpty()
                .withMessage('نباید اسلاگ خالی باشد!')
                .custom(async (value,{req})=>{
                    if(req.query._method === 'put') return;
                    let data = await Category.findOne({slug:value});
                    if(data){
                        throw new Error('چنین اسلاگی وجود دارد!')
                    }

                    
                }),
            check('color')
                .isHexColor()
                .withMessage('رنگ را درست انتخاب کنید!'),
            check('description')
                .not().isEmpty()
                .withMessage('توضیح نباید خالی باشد!')
                ,
            check('images')
                .custom(async (value,{req})=>{
                    if(req.query._method === 'put') return;
                    if(! value){
                        throw new Error('تصویری ارسال نکردید!')}
                    let fileExt = ['.png','.jpg','.jpeg','.svg']
                    if(! fileExt.includes(path.extname(value))){
                        throw new Error('پسوند تصویر مشکلی دارد!')
                        }
                })
        ]
    }
     
}

module.exports = new categoryValidator()