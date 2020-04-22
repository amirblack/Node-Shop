const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate  = require('mongoose-paginate-v2')



const postSchema = Schema({
    user : { type : Schema.Types.ObjectId , ref : 'User'},
    categories : {type : Schema.Types.ObjectId , ref : 'Category'},
    timepost:{type:Date ,require:true},
    title : { type : String , required : true },
    slug : { type : String , required : true },
    type : { type : Boolean , required : true },
    body : { type : String , required : true },
    sourcename:{ type : String , required : true },
    sourcelink:{ type : String , required : true },
    images : { type : String , required : true },
    tags : { type : Array , required : true },
    viewCount : { type : Number , default : 0 },
    commentCount : { type : Number , default : 0 },
    lang : {type:String,required:true}

} , { timestamps : true ,toJSON:{virtuals:true}});

postSchema.plugin(mongoosePaginate);

postSchema.methods.path = function(){
    return `/posts/${this.slug}`
}

postSchema.virtual('comments',{
    ref:'Comment',
    localField:'_id',
    foreignField:'Post',
})
postSchema.methods.inc = async function( field,num =1) {
     this[field] += num;
    await this.save();
} 
module.exports = mongoose.model('Post' , postSchema);