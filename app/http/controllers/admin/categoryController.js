//Modules
const Controller = require('app/http/controllers/controller');
const Category = require('app/models/Category');
const User = require('app/models/User');
const LiaraClient = require('app/helper/liaraClient');
const path = require('path');
class categoryController extends Controller {
    async index(req, res, next) {
        try {
            let page = req.query.page || 1;
            let categories = await Category.paginate({}, {
                page,
                limit: 5,
                sort: {
                    createdAt: -1
                },
                populate: 'parent'
            });
            let useruse = await User.findById(req.user.id).populate('myroles')
            res.render('admin/categories/index', {
                title: 'Categories',
                useruse,
                categories,
            })
        } catch (err) {
            next(err)
        }

    }
    async createCategory(req, res) {
        let categories = await Category.find();
        let useruse = await User.findById(req.user.id).populate('myroles')
        res.render('admin/categories/create', {
            title: 'createCategory',
            categories,
            useruse,
        })
    }
    async create(req, res, next) {
        try {
            let result = await this.validationData(req)
            if (! result) return this.back(req, res)
            let {
                name,
                slug,
                description
            } = req.body;
            let newCategory = new Category({
                name,
                images: req.file.location,
                slug,
                description,
            })
            await newCategory.save();
            return res.redirect('/admin/categories')

        } catch (err) {
            next(err)
        }

    }
    async destory(req, res, next) {
        try {
            this.isMongoId(req.params.id)
            let category = await Category.findById(req.params.id).populate('childs').exec()
            if (! category) this.error('چنین دسته ای یافت نشد', 404)

            category.childs.forEach(cate => cate.remove())
            await LiaraClient.removeObject('category', path.parse(category.images).base)
            category.remove()
            return this.alertBack(req, res, {
                title: 'با موفقیت حذف شد!',
                message: null,
                timer: 5000,
                type: 'success',
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
            let useruse = await User.findById(req.user.id).populate('myroles');
            if (! category) this.error('چنین دسته ای وجود ندارد', 404);
            return res.render('admin/categories/edit', {
                title: 'editCategory',
                category,
                useruse,
            })
        } catch (err) {
            next(err)
        }

    }
    async editCategory(req, res, next) {
        try {
            this.isMongoId(req.params.id)
            let result = await this.validationData(req)
            if (! result) {
                if (req.file) {
                    LiaraClient.removeObject('category', req.file.originalname)
                }
                return this.back(req, res)
            }
            let objUpdate = {}
            if (req.file) {
                objUpdate.images = req.file.location
            } else {
                objUpdate.images = req.body.imagesThumb;
            }
            let {
                name,
                parent,
                slug,
                description
            } = req.body;

            await Category.findByIdAndUpdate(req.params.id, {
                $set: {
                    name,
                    slug,
                    description,
                    ...objUpdate
                }
            })
            this.alertMessage(req, {
                title: 'توجه',
                message: 'شما با موفقیت دسته بندی را تغییر دادید!',
                timer: 4000,
                type: 'info'
            })
            return res.redirect('/admin/categories')
        } catch (err) {
            next(err)
        }

    }
    file(req, res, next) {
        if (! req.file) {
            req.body.images = undefined
        } else {
            req.body.images = req.file.originalname;
        }
        next()
    }

    // parent :parent !== 'none' ? parent : null

}
module.exports = new categoryController();
