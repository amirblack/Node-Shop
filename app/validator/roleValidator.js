const {check} = require('express-validator');
const Role = require('app/models/Role')
const validate = require('app/validator/validator')
class permissionValidator extends validate{
    handle() {
        return [
            check('name')
                .not().isEmpty()
                .withMessage('نام نباید خالی باشد!')
                .custom(async (value ,{req})=>{
                    if(req.query._method === 'put') {
                        let role = await Role.findById(req.params.id);
                        if(role.name === value) return;
                    }
                    let data = await Role.findOne({name:value});
                    if(data){
                        throw new Error('چنین سطح دسترسی ای قبلا وجود داشته است!')
                    }

                    
                }),
            check('label')
                .not().isEmpty()
                .withMessage('توضیح نباید خالی باشد!'),
            check('permissions')
                .not().isEmpty()
                .withMessage('اجازه نباید خالی باشد')
        ]
    }
}

module.exports = new permissionValidator()