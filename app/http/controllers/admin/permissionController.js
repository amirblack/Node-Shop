//Modules
const Controller = require('app/http/controllers/controller');
const Permission = require('app/models/Permission');
const User = require('app/models/User');

class permissionController extends Controller {
    async index(req, res, next) {
        try {
            let page = req.query.page || 1;
            let permissions = await Permission.paginate({}, {
                page,
                limit: 5,
                sort: {
                    createdAt: -1
                }
            });
            let useruse = await User.findById(req.user.id).populate('myroles')
            res.render('admin/permissions/index', {
                title: 'Permissions',
                permissions,
                useruse,
            })
        } catch (err) {
            next(err)
        }

    }
    async createPermission(req, res) {
        let useruse = await User.findById(req.user.id).populate('myroles')
        res.render('admin/permissions/create', {
            title: 'createPermission',
            useruse,
        })
    }
    async create(req, res, next) {
        try {
            let result = await this.validationData(req)
            if (! result) return this.back(req, res)
            let {
                name,
                label
            } = req.body;
            let newPermission = new Permission({
                name,
                label,
            })
            await newPermission.save();
            return res.redirect('/admin/users/permissions')

        } catch (err) {
            next(err)
        }

    }
    async destory(req, res, next) {
        try {
            this.isMongoId(req.params.id)
            let permissions = await Permission.findById(req.params.id);
            if (! permissions) this.error('چنین اجازه  ای یافت نشد', 404)
            permissions.remove()
            return this.alertBack(req, res, {
                title: 'حذف شد',
                message: null,
                timer: 5000,
                type: 'info',
                button: null,
            })

        } catch (err) {

            next(err)
        }

    }
    async getEdit(req, res, next) {
        try {
            this.isMongoId(req.params.id)
            let permissions = await Permission.findById(req.params.id);
            if (! permissions) this.error('چنین اجازه ای وجود ندارد', 404);
            let useruse = await User.findById(req.user.id).populate('myroles')
            return res.render('admin/permissions/edit', {
                title: 'editPermission',
                permissions,
                useruse,
            })
        } catch (err) {
            next(err)
        }

    }
    async editPermission(req, res, next) {
        try {
            this.isMongoId(req.params.id)
            let result = await this.validationData(req)
            if (! result) return this.back(req, res)
            let {
                name,
                label
            } = req.body;
            await Permission.findByIdAndUpdate(req.params.id, {
                $set: {
                    name,
                    label
                }
            })
            this.alertMessage(req, {
                title: 'توجه',
                message: 'اجازه مورد نظر با موفقیت تغییر کرد',
                timer: 4000,
                type: 'info'
            })
            return res.redirect('/admin/users/permissions')
        } catch (err) {
            next(err)
        }

    }


}
module.exports = new permissionController();
