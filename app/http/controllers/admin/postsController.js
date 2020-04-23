//Modules
const Controller = require('app/http/controllers/controller');
const Category = require('app/models/Category');
const Post = require('app/models/Post');
const path = require('path');
const User = require('app/models/User')
const moment = require('moment');
const LiaraClient = require('app/helper/liaraClient');

/////////////////////////
class postsController extends Controller {
    async index(req, res, next) {
        try {
            let page = req.query.page || 1;
            let posts = await Post.paginate({}, {
                page: page,
                limit: 5,
                sort: {
                    createdAt: -1,
                },
                select: 'title viewCount commentCount type'
            })
            let useruse = await User.findById(req.user.id, 'name email admin roles').populate([{
                path: 'myroles',
                select: 'label'
            }]);
            let authorposts = await Post.paginate({
                user: req.user.id
            }, {
                page: page,
                limit: 5,
                sort: {
                    createdAt: -1,
                },
                select: 'title viewCount commentCount type'
            })

            return res.render('admin/posts/index', {
                title: 'Posts',
                posts,
                useruse,
                authorposts,
            })

        } catch (err) {
            next(err)
        }

    }
    async createPost(req, res) {
        let categories = await Category.find({});
        let useruse = await User.findById(req.user.id).populate('myroles')
        res.render('admin/posts/create', {
            title: 'createPost',
            useruse,
            categories,
        })
    }
    async create(req, res, next) {
        try {

            let result = await this.validationData(req)
            if (! result) {
                if (req.file) {
                    LiaraClient.removeObject('post', req.file.originalname, function (err) {
                        if (err)
                            return console.log(err)
                        else
                            console.log('removed')
                    })
                }

                return this.back(req, res)
            }

            let images = req.file.location;
            let {
                title,
                body,
                tags,
                type,
                sourcelink,
                sourcename,
                categories,
                datepicker,
                timepicker,
                lang,
                slug,
            } = req.body;
            let space = " "
            let timepost = moment.utc(new Date(datepicker + space.concat(timepicker)).toISOString()).locale('en')

            let newPost = new Post({
                user: req.user._id,
                title,
                slug: this.slug(slug),
                body,
                images,
                type,
                categories,
                tags: this.getPostTags(tags),
                sourcename,
                sourcelink,
                lang,
                timepost,
            })

            await newPost.save();
            return res.redirect('/admin/posts')

        } catch (err) {

            next(err)
        }

    }
    async destory(req, res, next) {
        try {
            this.isMongoId(req.params.id)
            let destory = await Post.findById(req.params.id).populate('comments')
            if (! destory) return this.error('چنین پستی یافت نشد', 404)
            Object.values(destory.comments).forEach(comment => comment.remove())
            await LiaraClient.removeObject('post', path.parse(destory.images).base)
            await destory.remove()
            return res.redirect('/admin/posts')

        } catch (err) {

            next(err)
        }

    }
    async getEdit(req, res, next) {
        try {
            this.isMongoId(req.params.id)
            let posts = await Post.findById(req.params.id)
            if (! posts) {
                this.error('چنین محصولی یافت نشد', 404)
            }
            let categories = await Category.find({});
            let useruse = await User.findById(req.user.id).populate('myroles')
            return res.render('admin/posts/edit', {
                title: 'editTitle',
                posts,
                categories,
                useruse

            })
        } catch (err) {
            next(err)
        }

    }
    async editPost(req, res, next) {
        try {
            this.isMongoId(req.params.id)
            let result = await this.validationData(req)
            if (! result) {
                if (req.file) {
                    LiaraClient.removeObject('post', req.file.originalname, function (err) {
                        if (err)
                            return console.log(err)
                        else
                            console.log('removed')
                    })
                }
            }

            let objUpdate = {};
            if (req.file) {
                objUpdate.images = req.file.location;
            }
            objUpdate.images = req.body.imagesThumb
            delete req.body.images;
            objUpdate.slug = this.slug(req.body.slug)
            let space = " "
            let {
                title,
                body,
                type,
                sourcelink,
                sourcename,
                categories,
                datepicker,
                timepicker,
                lang,
            } = req.body;
            let now = new Date()
            let timepost = new Date(datepicker + space.concat(timepicker)).toUTCString()

            await Post.findByIdAndUpdate(req.params.id, {
                $set: {
                    user: req.user._id,
                    title,
                    body,
                    type,
                    categories,
                    sourcename,
                    sourcelink,
                    lang,
                    timepost,
                    tags: this.getPostTags(req.body.tags),
                    ...objUpdate
                }
            })

            return res.redirect('/admin/posts')
        } catch (err) {
            next(err)
        }

    }


    getPostTags(tags) {
        let tag = tags.split(',')
        return tag;
    }
    slug(title) {
        return title.replace(/([^۰-۹آ-یa-zA-Z0-9]|-)+/g, "-").toLowerCase()
    }
}
module.exports = new postsController();
