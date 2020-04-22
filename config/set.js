const path = require('path')
module.exports ={
    static:{
        static_files:'public',
        view_engine:'ejs',
        views:path.resolve('./resource/views'),
        langLocal:path.resolve('./resource/lang')
    },
    navbarConfig:{
        adminDash:process.env.ADMINDASH,
        brandname:process.env.BRANDNAME,
        
    }
}