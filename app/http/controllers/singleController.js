const Controller = require('app/http/controllers/controller')
const Single = require('app/models/Single');
const Category = require('app/models/Category')

class singleController extends Controller {

    async ads(req, res, next) {
        try {
            let single = await Single.findOne({
                slug: 'advertise'
            })
            if (!single) this.error('چنین صفحه ای وجود ندارد!', 404)
            let categories = await Category.find({}, 'name slug')
            let description = single.body.split(".")
            return res.render('single/index', {
                single,
                categories,
                description: description[0].substring(3),
                title: 'تبلیغات - لیجیاتو',
            });
        } catch (err) {
            next(err)
        }
    }
    async faq(req, res, next) {
        try {
            let single = await Single.findOne({
                slug: 'faq'
            })
            if (!single) this.error('چنین صفحه ای وجود ندارد!', 404)
            let categories = await Category.find({}, 'name slug')
            let description = single.body.split(".")
            return res.render('single/index', {
                single,
                categories,
                description: description[0].substring(3),
                title: 'سوالات متداول - لیجیاتو',
            })
        } catch (err) {
            next(err)
        }
    }
    async copyright(req, res, next) {
        try {
            let single = await Single.findOne({
                slug: 'copyright'
            })
            if (!single) this.error('چنین صفحه ای وجود ندارد!', 404)
            let categories = await Category.find({}, 'name slug')
            let description = single.body.split(".")
            return res.render('single/index', {
                single,
                categories,
                description: description[0].substring(3),
                title: 'کپی رایت - لیجیاتو',
            });
        } catch (err) {
            next(err)
        }
    }
    async contactus(req, res, next) {
        try {
            let single = await Single.findOne({
                slug: 'contactus'
            })
            if (!single) this.error('چنین صفحه ای وجود ندارد!', 404)
            let categories = await Category.find({}, 'name slug')
            let description = single.body.split(".")
            return res.render('single/index', {
                single,
                categories,
                description: description[0].substring(3),
                title: 'ارتباط با ما - لیجیاتو'
            });
        } catch (err) {
            next(err)
        }
    }
    async policy(req, res, next) {
        try {
            let single = await Single.findOne({
                slug: 'privacy-policy'
            })
            if (!single) this.error('چنین صفحه ای وجود ندارد!', 404)
            let categories = await Category.find({}, 'name slug')
            let description = single.body.split(".")
            return res.render('single/index', {
                single,
                categories,
                description: description[0].substring(3),
                title: 'حریم خصوصی و مقررات - لیجیاتو',
            });
        } catch (err) {
            next(err)
        }
    }
    async aboutus(req, res, next) {
        try {
            let single = await Single.findOne({
                slug: 'aboutus'
            })
            if (!single) this.error('چنین صفحه ای وجود ندارد!', 404)
            let categories = await Category.find({}, 'name slug')
            let description = single.body.split(".")
            return res.render('single/index', {
                single,
                categories,
                description: description[0].substring(3),
                title: 'درباره ما - لیجیاتو',
            });
        } catch (err) {
            next(err)
        }
    }


}
module.exports = new singleController();