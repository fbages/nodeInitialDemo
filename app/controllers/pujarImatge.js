const multer  = require('multer');
const path = require('path');
const multerconfig = {
  storage : multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname,"..","..","uploads"))
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
    }
  }),
  fileFilter: function(req, file, cb){
      checkFileType(file, cb);
  }
}
const upload = multer(multerconfig).single("image");

function checkFileType(file, cb){
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);
  if(mimetype && extname){
    return cb(null,true);
  } else {
    cb({"status":'false', "message": 'Upload only images, jpeg,jpg,png and gif'});
  }
}
exports.pujar=(req, res, next)=>{ 
 
  upload(req, res, (err) => {
    if(err) {
      res.status(400).send(err);
    }
    res.send(req.file);
  });
}