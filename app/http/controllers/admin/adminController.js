const Controller = require('app/http/controllers/controller');
const Post = require('app/models/Post');
const User = require('app/models/User');
const Category = require('app/models/Category')
const Comment = require('app/models/Comment')
class adminController extends Controller {
    async index(req, res, next) {
        try {
            let useruse = await User.findById(req.user.id).populate('myroles')
            res.render('admin/index', {
                title: 'Admin Home',
                useruse,
            });

        } catch (err) {
            next(err)
        }

    }
    uploadimage(req, res) {
        let image = req.file;
        res.json({
            "uploaded": 1,
            "filename": "post-" + image.originalname,
            "url": `${image.location}`
        })
    }
    async previews(req, res) {
        let posts = await Post.findById(req.params.id)
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
            previews: true,
            randomPost,
            title: posts.title + ' - لیجیاتو',
            categories,
            recap: this.recaptcha.render(),
            lastposts,
        })
    }
    async analyse(req, res, next) {
        try {
            let comments = await Comment.countDocuments({
                approved: true
            })
            let users = await User.countDocuments({})
            let activeUsers = await User.countDocuments({
                active: true
            })
            let posts = await Post.aggregate([{
                $group: {
                    _id: null,
                    total: {
                        $sum: "$viewCount"
                    }

                }
            }])
            let useruse = await User.findById(req.user.id).populate('myroles')
            res.render('admin/analyse', {
                title: 'analyse',
                posts,
                users,
                activeUsers,
                comments,
                useruse,
            });

        } catch (err) {
            next(err)
        }

    }

}
module.exports = new adminController();