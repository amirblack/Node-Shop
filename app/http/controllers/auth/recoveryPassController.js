const controller = require('app/http/controllers/controller')
const User = require('app/models/User')
const Category = require('app/models/Category')
const PasswordReset = require('app/models/PasswordReset')
class recoveryPassController extends controller{

    async showForm(req,res){
        let categories = await Category.find({})
        return res.render('auth/recoverypassword',{
            categories,
            title:'بازگردانی رمز عبور',
            recap:this.recaptcha.render(),
            token:req.params.token,
        })
    }
    async recoveryPassControllerProccess(req,res){
        // await this.recaptchValidation(req,res);
        let result = await this.validationData(req)
        if(result){
            return this.recoveryPassword(req,res)
        }
            return this.alertBack(req,res,{
            title:'دقت کنید',
            message:'مشکلی در فرم وجود دارد!',
            timer:4000,
            type:'error',
            button:null,
        });
    }
    async recoveryPassword(req,res){
        let field = await PasswordReset.findOne({$and:[{email:req.body.email},{token:req.body.token}]})
        if(! field){
            return this.alertBack(req,res,{
            title:'هشدار',
            message:'اطلاعات کاربر صحیح نمی باشد',
            timer:4000,
            type:'error',
            button:null,
        });
        }
        if(field.use){
            return this.alertBack(req,res,{
            title:'هشدار',
            message:'این لینک قبلا استفاده شده!',
            timer:4000,
            type:'error',
            button:null,
        });
        }
        let user = await User.findOne({ email : field.email });
        user.$set({password:user.hashPassword(req.body.password)})
        await user.save();
        if(! user){
            return this.alertBack(req,res,{
            title:'خطا',
            message:'در عملیات خطایی رخ داده',
            timer:4000,
            type:'error',
            button:null,
        });
        }
        await field.updateOne({use:true})
        
        this.alertMessage(req,{
            title:'رمز عبور شما با موفقیت تغییر کرد',
            message:null,
            timer:4000,
            type:'success',
            button:null,
        });
        return res.redirect('/auth/login')
    }
}


module.exports = new recoveryPassController()