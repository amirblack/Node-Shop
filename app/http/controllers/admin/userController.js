//Modules
const Controller = require('app/http/controllers/controller')
const User = require('app/models/User')
const fs = require('fs')
const Role = require('app/models/Role');

class userController extends Controller {
    async index(req, res, next) {
        try {
            let page = req.query.page || 1;
            let users = await User.paginate({}, {
                page,
                limit: 10,
                sort: {
                    createdAt: -1
                },
                populate: ([{
                    path: 'roles',
                    select: 'name'
                }])
            });
            let useruse = await User.findById(req.user.id).populate([{
                path: 'myroles'
            }])

            return res.render('admin/users/index', {
                title: 'Users',
                users,
                useruse,

            })
        } catch (err) {
            next(err)
        }

    }

    async create(req, res, next) {
        try {
            let result = await this.validationData(req)
            if (!result) return this.back(req, res)
            let {
                name,
                parent,
                images
            } = req.body;
            let newCategory = new Category({
                name,
                images,
                slug: this.slug(name),
                parent: parent !== 'none' ? parent : null
            })
            await newCategory.save();
            return res.redirect('/admin/categories')

        } catch (err) {
            next(err)
        }

    }
    async toggleadmin(req, res, next) {
        try {
            this.isMongoId(req.params.id)
            let user = await User.findById(req.params.id)
            if (!user) this.error('چنین کاربری یافت نشد!', 404)
            user.set({
                admin: !user.admin
            })
            await user.save();
            return this.back(req, res)
        } catch (err) {
            next(err)
        }
    }
    async destory(req, res, next) {
        try {
            this.isMongoId(req.params.id)
            let users = await User.findById(req.params.id).exec()
            if (!users) this.error('چنین کاربری  یافت نشد', 404)

            await users.remove()
            return this.alertBack(req, res, {
                title: 'توجه',
                message: 'کاربر مورد نظر حذف شد!',
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
            let category = await Category.findById(req.params.id);
            let categories = await Category.find({
                parent: null
            });
            if (!category) this.error('چنین دسته ای وجود ندارد', 404);
            let useruse = await User.findById(req.user.id).populate('myroles')
            return res.render('admin/categories/edit', {
                category,
                categories,
                useruse
            })
        } catch (err) {
            next(err)
        }

    }
    async editCategory(req, res, next) {
        try {
            this.isMongoId(req.params.id)
            let result = await this.validationData(req)
            if (!result) {
                if (req.file) {
                    fs.unlinkSync(req.file.path)
                }
                return this.back(req, res)
            }
            let objUpdate = {}
            objUpdate.images = req.body.imagesThumb
            if (req.file) {
                objUpdate.images = req.body.images
            }
            let {
                name,
                parent
            } = req.body;
            objUpdate.slug = name
            await Category.findByIdAndUpdate(req.params.id, {
                $set: {
                    name,
                    parent: parent !== 'none' ? parent : null,
                    ...objUpdate
                }
            })
            this.alertMessage(req, {
                title: 'توجه',
                message: 'شما با موفقیت دسته بندی را ویرایش کردید!',
                timer: 4000,
                type: 'info'
            })
            return res.redirect('/admin/categories')
        } catch (err) {
            next(err)
        }

    }
    async addrole(req, res, next) {
        try {
            this.isMongoId(req.params.id)
            let user = await User.findById(req.params.id);
            let roles = await Role.find({});
            if (!user) return this.error('چنین کاربری وجود ندارد!', 404)
            let useruse = await User.findById(req.user.id).populate('myroles')
            res.render('admin/users/addrole', {
                title: 'addRole',
                user,
                roles,
                useruse
            })

        } catch (err) {
            next(err)
        }
    }
    async storeRoleForUser(req, res, next) {
        try {
            this.isMongoId(req.params.id)
            let user = await User.findById(req.params.id);
            if (!user) this.error('چنین کاربری وجود ندارد', 404)
            user.set({
                roles: req.body.roles
            })
            await user.save()
            res.redirect('/admin/users')
        } catch (err) {
            next(err)
        }
    }
    async getCreate(req, res) {
        let useruse = await User.findById(req.user.id).populate('myroles')
        res.render('admin/users/create', {
            title: 'createUser',
            useruse
        })
    }
    async create(req, res, next) {
        try {
            let {
                name,
                email,
                password
            } = req.body
            let newuser = new User({
                name,
                email,
                password,
            })
            await newuser.save()
            return res.redirect('/admin/users')

        } catch (err) {
            next(err)

        }
    }


}
module.exports = new userController();
