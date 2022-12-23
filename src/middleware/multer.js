var aws = require("aws-sdk");
var multer = require("multer");
var multerS3 = require("multer-s3");
require("dotenv").config();

var s3 = new aws.S3({
  accessKeyId: process.env.accessKeyId,
  secretAccessKey: process.env.secretAccessKey,
});

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: "profilepageggn",
    acl: "public-read",
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      cb(null, Date.now() + "-" + file.originalname);
    },
  }),
});

console.log(upload);

const uploadSingle = (fieldName) => {
  return (req, res, next) => {
    const createUserFun = upload.single(fieldName);

    createUserFun(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        // A Multer error occurred when uploading.
        res.send({ message: err.message, errorType: "MulterError" });
      } else if (err) {
        // An unknown error occurred when uploading.
        res.send({ message: err.message, errorType: "NormalError" });
      }
      // Everything went fine.
      next();
    });
  };
};

module.exports = { uploadSingle };
