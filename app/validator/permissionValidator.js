const {check} = require('express-validator');
const Permission = require('app/models/Permission')
const validate = require('app/validator/validator')
const path = require('path')
class permissionValidator extends validate{
    handle() {
        return [
            check('name')
                .not().isEmpty()
                .withMessage('نام نباید خالی باشد!')
                .custom(async (value ,{req})=>{
                    if(req.query._method === 'put') {
                        let permission = await Permission.findById(req.params.id);
                        if(permission.name === value) return;
                    }
                    let data = await Permission.findOne({name:value});
                    if(data){
                        throw new Error('چنین اجازه ای قبلا وجود داشته است!')
                    }

                    
                }),
            check('label')
                .not().isEmpty()
                .withMessage('توضیح نباید خالی باشد!'),
    
        ]
    }
}

module.exports = new permissionValidator()