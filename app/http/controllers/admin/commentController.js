//Modules
const Controller = require('app/http/controllers/controller')
const Comment = require('app/models/Comment')
const User = require('app/models/User');


/////////////////////////
class Comments extends Controller {
    async index(req, res, next) {
        try {
            let page = req.query.page || 1;
            let Post = ({
                path: 'Post',
                select: 'title'
            })
            let comments = await Comment.paginate({
                approved: false
            }, {
                page,
                limit: 20,
                sort: {
                    createdAt: -1
                },
                populate: Post,
            });
            let useruse = await User.findById(req.user.id).populate('myroles')
            res.render('admin/comments/index', {
                title: 'Comment Home',
                comments,
                useruse,

            })

        } catch (err) {
            next(err)
        }

    }
    async destory(req, res, next) {
        try {
            this.isMongoId(req.params.id)
            let comments = await Comment.findById(req.params.id)
            if (! comments)
                this.error('چنین کامنتی یافت نشد', 404)
            comments.remove()
            return this.alertBack(req, res, {
                title: 'توجه',
                message: 'نظر مورد نظر حذف شد',
                timer: 5000,
                type: 'success',
                button: null,

            })

        } catch (err) {

            next(err)
        }

    }
    async approved(req, res, next) {
        try {
            let page = req.query.page || 1;
            let comments = await Comment.paginate({
                approved: true
            }, {
                page,
                select: 'name comment Post',
                limit: 20,
                sort: {
                    createdAt: -1
                },
                populate: [{
                    path: 'user',
                    select: 'name',
                }, {
                    path: 'Post',
                    select: 'title'
                }]
            });
            let useruse = await User.findById(req.user.id).populate('myroles')

            res.render('admin/comments/approved', {
                title: 'Approved Home',
                comments,
                useruse,

            })

        } catch (err) {
            next(err)
        }
    }

    async update(req, res, next) {
        try {
            this.isMongoId(req.params.id)
            let comments = await Comment.findById(req.params.id).populate('belongTo').exec();
            if (! comments) this.err('چنین کامنتی وجود ندارد', 404)
            await comments.belongTo.inc('commentCount')
            comments.approved = true
            await comments.save()

            return this.alertBack(req, res, {
                title: 'توجه',
                message: 'نظر مورد نظر تایید شد',
                timer: 5000,
                type: 'success',
                button: null,
            })
        } catch (err) {
            next(err)
        }
    }




}
module.exports = new Comments();
