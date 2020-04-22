const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const schema = mongoose.Schema

const singleSchema = schema({
    title:{type:String,required:true},
    slug:{type:String,required:true},
    body:{type:String,required:true},
    images:{type:String,required:true},
},{timestamps:true})

singleSchema.plugin(mongoosePaginate)

singleSchema.methods.path = function(){
    return `/${this.slug}`
}
module.exports = mongoose.model('Single',singleSchema)