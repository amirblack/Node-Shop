const express = require('express');
const app = express();
const http = require('http');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const Helpers = require('./helpers');
const rememberLogin = require('app/http/middlewares/rememberLogin');
const actUser = require('app/http/middlewares/actUser');
const config = require('../config');
const expressLayouts = require('express-ejs-layouts');
const methodOverride = require('method-override');
const gate = require('app/helper/gate');
const helmet = require('helmet')
const rateLimit = require("express-rate-limit");
const compression = require('compression');
const robots = require('express-robots-txt');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000,
  handler: function(req,res,next){
      res.json({
          data:'درخواست شما زیاد بوده است لطفا 15 دقیقه دیگر دوباره تلاش کنید',
          status:'error'
      })
  },
});
module.exports = class Application {
    constructor() {
        this.setupExpress();
        this.setMongoConnection();
        this.setConfig();
        this.setRouters();
    }

    setupExpress() {
        const server = http.createServer(app);
        server.listen(config.port, () => console.log('Server is Running!'));
    }

    setMongoConnection() {
        mongoose.Promise = global.Promise;
        mongoose.connect(config.database.url, {
            ...config.database.options
        });
        mongoose.connection.on('open',function(){
            console.log('Mongo Server is Running!')
        })
    }

    /* Express Config */
    setConfig() {
        app.use(helmet())
        app.use(helmet.xssFilter())
        app.use(helmet.frameguard())
        app.use(limiter);
        app.use(express.static(config.set.static.static_files,{maxAge:2592000000,setHeaders: function(res, path) {res.setHeader("Expires", new Date(Date.now() + 2592000000*12).toUTCString());}}));
        app.set('view engine', config.set.static.view_engine);
        app.set('views', config.set.static.views);
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({
            extended: true
        }));
        // app.use(validator());
        app.use(session(config.session));
        app.use(cookieParser(process.env.SECRET_COOKIE));
        app.use(flash());
        require('app/passport/passport-local');
        app.use(compression());
        app.use(expressLayouts);
        app.set('layout','master');
        app.set("layout extractScripts", true);
        app.set('layout extractStyles',true);
        app.use(methodOverride('_method'));
        app.use(passport.initialize());
        app.use(passport.session());
        app.use(rememberLogin.handle);
        app.use(gate.middleware()); 
        app.use(robots({UserAgent: '*', Disallow: '/', CrawlDelay: '5', Sitemap: `${config.websiteurl}/sitemap.xml`})) 
        app.use((req, res, next) => {
            app.locals = new Helpers(req, res).getObjects(),
                next();
        });

    }

    setRouters() {
        app.use(actUser.handle)
        app.use(require('app/routes/web'));
        app.use(require('app/routes/api/index'));
        
    }

}