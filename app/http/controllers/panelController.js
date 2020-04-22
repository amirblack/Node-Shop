const User = require('app/models/User');
const Category = require('app/models/Category');
const Controller = require('app/http/controllers/controller')

class panelController extends Controller{
        async index(req,res,next){
            try {
                let categories = await Category.find({})
                return res.render('panel/index',{
                title:'پنل کاربری',
                categories,
                extractScripts: true ,
                extractStyles:true,
            })
            } catch (err) {
                next(err)
            }
            
        }
        async changepassword(req,res,next){
            try {
                    let result = await this.validationData(req)
                    if(! result){
                         this.alertMessage(req,{
                            title:'دقت کنید',
                            message:'مشکلی در فیلد ها وجود دارد!',
                            timer:10000,
                            button:true,
                            type:'error',
                        })
                        return res.redirect('/panel#setting')
                    }
                    else{
                        
                    let user = await User.findOne({email:req.user.email},async (err,man)=>{
                        if(err) throw err;
                        if(! man.comparePassword(req.body.oldpassword)){
                            return this.alertBack(req,res,{
                                title:'دقت کنید!',
                                message:'اطلاعات کاربری نادرست می باشد!',
                                timer:5000,
                                type:'error',
                                button:null,
                            })
                        }
                        }) 
                        
                            user.$set({password:user.hashPassword(req.body.newpassword)})
                            await user.save()
                            await this.alertMessage(req,{
                                title:'عملیات با موفقیت انجام شد!',
                                message:null,
                                timer:5000,
                                type:'success',
                                button:null,
                            })
                            return res.redirect('/panel#setting')
                        }
                    
            } catch (err) {
                next(err)
            }
        }
        async editdata(req,res,next){
            try {
                let result = await this.validationData(req)
                if(result){
                let user = await User.findOne({email:req.user.email});
                user.set({name:req.body.name})
                await user.save()
                this.alertMessage(req,{
                                title:'عملیات با موفقیت انجام شد!',
                                message:null,
                                timer:3000,
                                type:'success',
                                button:null,
                            })
                return  res.redirect('/panel#editname')
                }
                else{
                    return res.redirect('/panel#editname')
                }
            } catch (err) {
                next(err)
            }
        }
}

module.exports = new panelController();