const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate  = require('mongoose-paginate-v2')

const categorySchema = Schema({
    name : { type : String,required:true},
    slug : { type : String,required:true},
    description : { type:String,required:true},
    parent :{type:Schema.Types.ObjectId,ref : 'Category',default:null},
    images : {type:String , required:true}
} , { timestamps : true ,toJSON:{virtuals:true}});

categorySchema.plugin(mongoosePaginate);
categorySchema.methods.path = function(){
    return `/categories/${this.slug}`
}

categorySchema.virtual('post',{
    ref:'Post',
    localField:'_id',
    foreignField:'categories'
})
categorySchema.virtual('childs',{
    ref:'Category',
    localField:'_id',
    foreignField:'parent',
})



module.exports = mongoose.model('Category' , categorySchema);