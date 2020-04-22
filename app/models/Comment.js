const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate  = require('mongoose-paginate-v2')

const commentSchema = Schema({
    user : { type :Schema.Types.ObjectId,ref:'User'},
    parent :{type:Schema.Types.ObjectId,ref : 'Comment',default:null},
    approved: {type:Boolean,default:false},
    comment : { type : String , required : true },
    name: { type:String,required:true},
    email : { type:String,default:null},
    Post : { type : Schema.Types.ObjectId , ref:'Post',default:undefined  },
} , { timestamps : true ,toJSON:{virtuals:true}});

commentSchema.plugin(mongoosePaginate);

commentSchema.virtual('commentsParent',{
    ref:'Comment',
    localField:'_id',
    foreignField:'parent',
})

commentSchema.virtual('belongTo',{
    ref:'Post',
    localField:'Post',
    foreignField:'_id',
    justOne:true
})


module.exports = mongoose.model('Comment' , commentSchema);