const User = require('app/models/User');
const Passport = require('passport');
const localStrategy = require('passport-local').Strategy;

Passport.serializeUser(function (user, done) {
    done(null, user.id)
})
Passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user)
    })
})
Passport.use('local.register', new localStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true,
}, (req, email, password, done) => {
    User.findOne({
        'email': email
    }, (err, user) => {
        if (err) return done(err)
        if (user) return done(null, false, req.flash('errors', 'این حساب کاربری قبلا وجود داشته است'))
        const newUser = new User({
            name: req.body.name,
            email: req.body.email,
        })
        newUser.$set({password:newUser.hashPassword(req.body.password)})
        newUser.save(err => {
            if (err) return done(err, false, req.flash('errors', 'ثبت نام با مشکل مواجه شده!'))
            done(null, newUser)
        })
    })
}))
Passport.use('local.login', new localStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true,
}, (req, email, password, done) => {
    User.findOne({
        'email': email
    }, (err, user) => {
        if (err) return done(err)

        if (! user || ! user.comparePassword(password)) {
            return done(null, false, req.flash('errors', 'ایمیل یا رمز عبور اشتباه است'))
        }
        done(null, user)

    })
}))