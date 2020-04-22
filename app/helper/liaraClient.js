const Liara = require('@liara/sdk');



const LiaraClient = new Liara.Storage.Client({
    accessKey:process.env.Liaraclientkey,
    secretKey:process.env.Liarasecretkey,
    endPoint:process.env.Liaraendpoint,
})


module.exports = LiaraClient;