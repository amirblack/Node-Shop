const autoBind = require("auto-bind")

module.exports = class validate{
    constructor(){
        autoBind(this)
    }
}