module.exports ={
    url:process.env.MONGO_URL,
    options:{
        useUnifiedTopology:true,useNewUrlParser:true,useCreateIndex:true,useFindAndModify:false,
    }
}