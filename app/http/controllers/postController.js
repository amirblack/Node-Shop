const Controller = require('app/http/controllers/controller')
const Post = require('app/models/Post');
const Comment = require('app/models/Comment');
const Category = require('app/models/Category');
class postController extends Controller {

    async index(req, res) {
        let posts = await Post.findOneAndUpdate({
                slug: req.params.post
            }, {
                $inc: {
                    viewCount: 1
                }
            })
            .populate([{
                path: 'user',
                select: 'name'
            }, ])
            .populate([{
                path: 'categories',
                select: 'name slug parent',
                populate: [{
                    path: 'parent',
                    select: 'name slug'
                }]
            }])
            .populate([{
                    path: 'comments',
                    match: {
                        approved: true,
                        parent: null
                    },

                    populate: [{
                            path: 'user',
                            select: 'name'
                        }, {
                            path: 'commentsParent',
                            match: {
                                approved: true
                            },
                            populate: {
                                path: 'user',
                                select: 'name'
                            }
                        }


                    ]
                }

            ])

        let randomPost = await Post.find({
            categories: posts.categories.id,
            title: {
                $ne: posts.title
            }
        }).limit(5).sort({
            createdAt: -1
        }).populate('user', 'name').exec()
        let categories = await Category.find({}, 'name slug')
        let description = posts.body.split(".");
        let lastposts = await Post.find({
            title: {
                $ne: posts.title
            }
        }, 'title slug timepost createdAt').limit(5).sort({
            createdAt: -1
        })
        return res.render('post/index', {
            posts,
            description: description[0].substring(3),
            previews: false,
            randomPost,
            title: posts.title + ' - لیجیاتو',
            categories,
            recap: this.recaptcha.render(),
            lastposts,
        })
    }
    async comment(req, res, next) {
        try {

            if (!req.isAuthenticated()) {
                await this.recaptchValidation(req, res);
            }

            let status = await this.validationData(req)
            if (!status) return res.json('Error!')

            let newComment = new Comment({
                email: this.checkIt(req)[0],
                name: this.checkIt(req)[1],
                user: this.checkIt(req)[2],
                comment: req.body.comment,
                Post: req.body.post,
                parent: this.checkIt(req)[3],

            })
            if (req.user.admin) {
                newComment.set({
                    approved: true
                })
            } else {
                newComment.set({
                    approved: false
                })
            }
            await newComment.save();
            return this.alertBack(req, res, {
                title: 'با تشکر',
                message: 'نظر شما با موفقیت ثبت شد!',
                timer: 4000,
                type: 'success',
                button: null,
            })

        } catch (err) {
            next(err)
        }
    }
    checkIt(req) {
        let email = req.body.email || req.user.email,
            name = req.body.name || req.user.name,
            user = req.user ? req.user.id : null,
            parent = req.body.parent || null;
        let result = [email, name, user, parent]
        return result;
    }
}
module.exports = new postController();