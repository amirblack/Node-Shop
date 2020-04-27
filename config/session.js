const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');
module.exports ={
    secret :process.env.SECRET_SESSION,
    resave : true,
    saveUninitialized : true,
    cookie:{expires:new Date(Date.now()+1000*60*60*12),SameSite:true,Secure:true},
    store : new MongoStore({ mongooseConnection : mongoose.connection })
}