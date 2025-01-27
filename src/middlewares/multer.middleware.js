import multer from "multer";

// Storage Engine Define
const storage = multer.diskStorage({
    // file -> multer handle karne ke liye use
    destination: function (req, file, cb) {
      cb(null, './public/temp')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    //   read doc
    }
  }) 
  
const upload = multer({
    storage: storage,
})

export {upload};