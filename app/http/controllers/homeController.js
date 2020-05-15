const Controller = require('app/http/controllers/controller');
const Post = require('app/models/Post');
const Single = require('app/models/Single')
const Category = require('app/models/Category');
const sm = require('sitemap')
class homeController extends Controller {
    async index(req, res) {

        let postslider = await Post.find({
                type: true,
                timepost:{$lte:Date.now()}
            }, 'title , slug , timepost , updatedAt , images').sort({
                createdAt: -1
            }).limit(4),
            categories = await Category.find({})
            .populate([{
                path: 'post',
                select: 'title images body slug updatedAt timepost',
                options: {
                    limit: 9,
                    sort: {
                        createdAt: -1
                    },
                },
                match: {
                    type: true,
                    timepost:{$lte:Date.now()}
                },
            }])
            .sort({
                createdAt: -1,
            }),

            hotposts = await Post.find({
                type: true,
                timepost:{$lte:Date.now()},
            })
            .sort({
                viewCount: -1,
            }).limit(6),
            mostComment = await Post.find({
                type: true,
                timepost:{$lte:Date.now()},
            })
            .sort({
                commentCount: -1,
            }).limit(6),
            lastPosts = await Post.find({
                type: true,
                timepost:{$lte:Date.now()},
            }).sort({
                createdAt: -1,
            }).limit(6);
        return res.render('home/index', {
            postslider,
            categories,
            hotposts,
            mostComment,
            lastPosts,
            title:'لیجیاتو - یادگیری مهارت های نو در هر لحظه از زندگی',
            description: config.description,
        })
    }
    async posts(req, res) {
        let page = req.query.page || 1;
        let posts = await Post.paginate({
            type: true,
            timepost:{$lte:Date.now()},
        }, {
            page,
            limit: 10,
            sort: {
                createdAt: -1
            }
        }, 'title body slug images timepost')
        let categories = await Category.find({}, 'name slug')
        return res.render('home/allposts', {
            posts,
            description: 'آخرین مطالب - لیجیاتو',
            title: 'آخرین مطالب - لیجیاتو',
            categories,
        })
    }
    async tags(req, res) {

        let page = req.query.page || 1;
        let tags = await Post.paginate({
            tags: req.params.tag,
            type: true,
            timepost:{$lte:Date.now()},
        }, {
            page,
            limit: 10,
            sort: {
                createdAt: -1
            }
        }, 'title body slug images timepost')
        let name = req.params.tag;
        let categories = await Category.find({}, 'name slug')
        return res.render('home/tag', {
            tags,
            name,
            description: name,
            title: name + ' - لیجیاتو',
            categories,
        })
    }
    async categoriesall(req, res) {
        let categories = await Category.find({}, 'name slug images')
        return res.render('home/categoriesall', {
            categories,
            description: 'دسته بندی ها - لیجیاتو',
            title: 'دسته بندی ها - لیجیاتو',
        })
    }
    async categories(req, res) {
        let page = req.query.page || 1;
        let categoryfinder = await Category.findOne({
            slug: req.params.category
        }, 'name images slug description')
        let category = await Post.paginate({
            categories: categoryfinder.id,
            type: true,
            timepost:{$lte:Date.now()},
        }, {
            page,
            limit: 10,
            sort: {
                createdAt: -1
            },
            select: 'title body slug images timepost'
        })
        let categories = await Category.find({}, 'name  slug')
        return res.render('home/category', {
            category,
            categories,
            categoryfinder,
            description: categoryfinder.description,
            title: categoryfinder.name + ' - لیجیاتو',
        })
    }
    async search(req, res) {
        let query = {};
        let {
            search,

        } = req.query;
        if (search)
            query.title = new RegExp(req.query.search, 'gi')

        let posts = Post.find({
            ...query,
            type: true,
            timepost:{$lte:Date.now()},
        }, 'title images body slug timepost')

        posts = await posts.exec()
        let categories = await Category.find({})
        return res.render('home/search', {
            posts,
            categories,
            description: `نتایج جستجو برای ${req.query.search}`,
            title: `نتایج جستجو برای "${req.query.search}" - لیجیاتو`
        })
    }
    async sitemap(req, res, next) {
        try {
            let mysitemap = sm.createSitemap({
                hostname: config.websiteurl,
            });
            mysitemap.add({
                url: '/',
                changefreq: 'hourly',
                priority: 1
            });
            mysitemap.add({
                url: '/posts',
                changefreq: 'hourly',
                priority: 1
            });
            mysitemap.add({
                url: '/categories',
                changefreq: 'monthly',
                priority: 0.5
            });
            
            let posts = await Post.find({timepost:{$lte:Date.now()}}).sort({
                createdAt: -1
            }).exec();
            posts.forEach(post => {
                mysitemap.add({
                    url: post.path(),
                    changefreq: 'hourly',
                    priority: 1
                })
            });
            let single = await Single.find({},"slug")
            single.forEach(sing=>{
            mysitemap.add({
                url: `/page/${sing.slug}`,
                changefreq: 'yearly',
                priority: 0.3
            });
            })
            let categories = await Category.find({}).sort({
                createdAt: -1
            }).exec();
            categories.forEach(cate => {
                mysitemap.add({
                    url: cate.path(),
                    changefreq: 'daily',
                    priority: 0.7
                })
            })
            res.header('Content-type', 'application/xml');
            res.send(mysitemap.toString());


        } catch (err) {
            next(err)
        }
    }
}
module.exports = new homeController();