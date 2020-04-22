const database = require('./database');
const set = require('./set');
const session = require('./session');
const service = require('./service');
module.exports ={
    port:process.env.PORT,
    database,
    set,
    session,
    service,
    websiteurl:process.env.WEBSITEURL,
    description:process.env.DESCRIPTION,
    keysentence:process.env.KEYSENTENCE,
    debug:false,
}