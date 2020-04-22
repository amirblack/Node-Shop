//Modules
const multer = require('multer');
const multerS3 = require('multer-s3');
const AWS = require('aws-sdk');


const s3 = new AWS.S3({
  signatureVersion: 'v4',
  s3ForcePathStyle: 'true',
  endpoint:process.env.Liaraendpoint ,
  credentials: {
    accessKeyId:process.env.Liaraclientkey,
    secretAccessKey:process.env.Liarasecretkey,
  },
});
const uploadCategory = multer({
  storage: multerS3({
    s3,
    bucket: 'category',
    metadata: function (req, file, cb) {
      cb(null, {fieldName: file.fieldname});
    },
    key: function (req, file, cb) {
      cb(null, file.originalname)
    }
  }),
});

module.exports = uploadCategory;