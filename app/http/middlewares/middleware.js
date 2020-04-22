const autobind = require('auto-bind');

module.exports = class Middleware{
    constructor(){
        autobind(this)
    }
}