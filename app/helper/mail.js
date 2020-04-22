
const nodemailer = require('nodemailer');


let transporter = nodemailer.createTransport({
        host:'smtp.zoho.com',
        port:465,
        auth: {
        user:"info@ligiato.com",// generated ethereal user
        pass:"qAzwsxedc@1234", // generated ethereal password
        }
    });
transporter.verify(function(error, success) {
  if (error) {
    console.log(error);
  } else {
    console.log("Mail Server is Running!");
  }
});
module.exports = transporter;