//Modules
const Controller = require('app/http/controllers/controller');
const Single = require('app/models/Single');
const LiaraClient = require('app/helper/liaraClient');
const User = require('app/models/User');
const path = require('path');

class singleController extends Controller {
    async index(req, res, next) {
        try {
            let page = req.query.page || 1;
            let single = await Single.paginate({}, {
                page,
                limit: 5,
                sort: {
                    createdAt: -1
                },
                populate: 'parent'
            });
            let useruse = await User.findById(req.user.id).populate('myroles')
            res.render('admin/single/index', {
                title: 'SinglePages',
                useruse,
                single,
            })
        } catch (err) {
            next(err)
        }

    }
    async createSingle(req, res) {
        let useruse = await User.findById(req.user.id).populate('myroles')
        res.render('admin/single/create', {
            title: 'createSingle',
            useruse
        })
    }
    async create(req, res, next) {
        try {
            let result = await this.validationData(req)
            if (!result) return this.alertBack(req, res, {
                title: 'دقت کنید',
                message: '!مشکلی در فرم ها وجود دارد',
                timer: 5000,
                type: 'error',
                button: false,
            })
            let {
                title,
                slug,
                body
            } = req.body;
            let newSingle = new Single({
                body,
                slug,
                images: req.file.location,
                title,
            })
            await newSingle.save();
            return res.redirect('/admin/single-pages')

        } catch (err) {
            next(err)
        }

    }
    async destory(req, res, next) {
        try {
            this.isMongoId(req.params.id)
            let single = await Single.findById(req.params.id)
            if (!single) this.error('چنین صفحه ای یافت نشد', 404)
            await LiaraClient.removeObject('single', path.parse(single.images).base)
            single.remove()
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
            let single = await Single.findById(req.params.id);
            if (!single) this.error('چنین صفحه ای وجود ندارد', 404);
            let useruse = await User.findById(req.user.id).populate('myroles')
            return res.render('admin/single/edit', {
                title: 'editSingle',
                single,
                useruse
            })
        } catch (err) {
            next(err)
        }

    }
    async editSingle(req, res, next) {
        try {
            this.isMongoId(req.params.id)
            let result = await this.validationData(req)
            if (!result) {
                if (req.file) {
                    LiaraClient.removeObject('single', req.file.originalname)
                }
                return this.alertBack(req, res, {
                    title: 'خطا!',
                    message: null,
                    timer: 5000,
                    type: 'info',
                    button: false,
                })
            }
            let objUpdate = {}
            if (req.file) {
                objUpdate.images = req.file.location
            }
            objUpdate.images = req.body.imagesThumb;
            let {
                body,
                slug,
                title
            } = req.body;

            await Single.findByIdAndUpdate(req.params.id, {
                $set: {
                    body,
                    title,
                    slug,
                    ...objUpdate
                }
            })
            this.alertMessage(req, {
                title: 'توجه',
                message: 'شما با موفقیت  تک صفحه را تغییر دادید!',
                timer: 4000,
                type: 'info'
            })
            return res.redirect('/admin/single-pages')
        } catch (err) {
            next(err)
        }

    }
    file(req, res, next) {
        if (!req.file) {
            req.body.images = undefined
        } else {
            req.body.images = req.file.originalname;
        }
        next()
    }


}
module.exports = new singleController();
