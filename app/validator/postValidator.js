const {check} = require('express-validator');
const autobind = require('auto-bind')
const Post = require('app/models/Post')
const validate = require('app/validator/validator')
const path = require('path')
class productCreateValidator extends validate{


    handle() {
        return [
            check('title')
                .not().isEmpty()
                .withMessage('تیتر خالی می باشد!')
                .custom(async (value,{req})=>{
                    if(req.query._method === 'put') return;
                    let title = await Post.findOne({title:value})
                    if(title){
                        throw new Error('این تیتر قبلا استفاده شده')
                    }                 
                }),
            check('slug')
                .not().isEmpty()
                .withMessage('')
                .custom(async (value,{req})=>{
                    if(req.query._method === 'put') return;
                    let slug = await Post.findOne({slug:this.slug(value)})
                    if(slug){
                        throw new Error('این اسلاگ وجود دارد!')
                    }
                }),
            check('images')
                .custom(async (value,{req})=>{
                    if(req.query._method === 'put') return;
                    if(! value){
                        throw new Error('تصاویر نباید خالی باشد!')}
                    let fileExt = ['.png','.jpg','.jpeg','.svg']
                    if(! fileExt.includes(path.extname(value))){
                        throw new Error('پسوند تصویر نادرست است!')
                        }
                })
                ,

            check('type')
                .not().isEmpty()
                .withMessage('وضعیت نباید خالی باشد!'),
            check('body')
                .isLength({min:20})
                .withMessage('متن حداقل باید 20 کاراکتر باشد!'),
            check('sourcename')
                .not().isEmpty()
                .withMessage('نام منبع نباید خالی باشد!'),
            check('sourcelink')
                .isURL()
                .withMessage('لینک منبع نباید خالی باشد!'),
            check('categories')
                .not().isEmpty()  
                .withMessage('دسته بندی نباید خالی باشد!'),  
            check('tags')
                .not().isEmpty()
                .withMessage('تگ ها نباید خالی باشد!'),
        ]
    }
    slug(title){
        return title.replace(/([^۰-۹آ-یa-zA-Z0-9]|-)+/g , "-").toLowerCase()
    }
}

module.exports = new productCreateValidator()