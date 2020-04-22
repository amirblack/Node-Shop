//Modules
const Controller = require('app/http/controllers/controller');
const Role = require('app/models/Role');
const Permission = require('app/models/Permission');
const User = require('app/models/User');

class roleController extends Controller {
    async index(req, res,next) {
        try {
            let page  = req.query.page || 1;
            let roles = await Role.paginate({},{page,limit:5,sort:{createdAt:-1}});
            let useruse  = await User.findById(req.user.id).populate('myroles')
            res.render('admin/roles/index', {
                title: 'Roles',
                roles,
                useruse,
            })
        } catch (err) {
            next(err)
        }
       
    }
    async createRole(req, res) {
        let permissions = await Permission.find({});
        let useruse  = await User.findById(req.user.id).populate('myroles')
        res.render('admin/roles/create',{
            title:'createRole',
            useruse,
            permissions})
    }
    async create(req, res,next) {
        try {
            let result = await this.validationData(req)
            if (!result) return this.back(req, res)
            let {name,label,permissions} = req.body;
            let newRole = new Role({ 
                name,
                label,
                permissions,
            })
            await newRole.save();
            return res.redirect('/admin/users/roles')
            
        } catch (err) { next(err)}
        
    }
    async destory(req,res,next){
        try {
            this.isMongoId(req.params.id)
            let roles = await Role.findById(req.params.id);
            if(! roles) this.error('چنین سطح دسترسی  یافت نشد',404)
            roles.remove()
            return this.alertBack(req,res,{
                title:'حذف شد!',
                message:null,
                timer:5000,
                type:'info',
                button:null,
            })
            
        } catch (err) {
            
            next(err)
        }
      
    }
      async getEdit(req,res,next){
          try {
                this.isMongoId(req.params.id)
                
                let roles = await Role.findById(req.params.id);
                let permissions = await Permission.find()
                if( ! roles ) this.error('چنین سطح دسترسی ای وجود ندارد' , 404);
                let useruse  = await User.findById(req.user.id).populate('myroles')
                return res.render('admin/roles/edit',{
                    title:'editRole',
                    roles,
                    useruse,
                    permissions,
                })
          } catch (err) {
              next(err)
          }
       
    }
    async editRole(req,res,next){
        try {
            this.isMongoId(req.params.id)
            let result = await this.validationData(req)
            if(! result) return this.back(req,res)
            let {name,label,permissions} = req.body;
            await Role.findByIdAndUpdate(req.params.id,{$set:{
                name,label,permissions,
                }})           
             this.alertMessage(req,{
                title:'توجه',
                message:'دسترسی مورد نظر با موفقیت ویرایش شد!',
                timer:4000,
                type:'info'
            })
            return res.redirect('/admin/users/roles')
        } catch (err) {
            next(err)
        }
   
    }
    


}
module.exports = new roleController();

