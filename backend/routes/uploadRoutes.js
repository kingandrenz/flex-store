import express from "express";

// Ensure this path matches where you saved your config file
import productUpload from "../config/cloudinaryConfig.js";

const router = express.Router();

const uploadSingle = productUpload.single("image");

// @route POST /api/upload
router.post("/", (req, res) => {
  uploadSingle(req, res, (err) => {
    if (err) {
      return res.status(400).send({ message: err.message || err });
    }

    if (!req.file) {
      return res.status(400).send({ message: "No file selected" });
    }

    // req.file.path contains the permanent Cloudinary URL
    res.status(200).send({
      message: "File uploaded successfully to Cloudinary",
      image: req.file.path,
    });
  });
});

export default router;

// import express from "express";
// import path, { extname } from "path";
// import multer from "multer";

// const router = express.Router();

// // Set up storage for uploaded files
// const storage = multer.diskStorage({
//   destination(req, file, cb) {
//     cb(null, "uploads/");
//   },
//   filename(req, file, cb) {
//     const extname = path.extname(file.originalname);
//     cb(null, `${file.fieldname}-${Date.now()}${extname}`);
//   },
// });

// const fileFilter = (req, file, cb) => {
//   const allowedFileTypes = /\.(jpe?g|png|webp)$/i;
//   const mimeTypes = /image\/(jpe?g|png|webp)/i;

//   const extname = path.extname(file.originalname);
//   const mimetype = file.mimetype;

//   if (allowedFileTypes.test(extname) && mimeTypes.test(mimetype)) {
//     return cb(null, true);
//   } else {
//     cb("Invalid file type. Only JPEG, PNG and WEBP files are allowed.");
//   }
// };

// const upload = multer({
//   storage,
//   fileFilter,
// });

// const uploadSingle = upload.single("image");

// // @route POST /api/upload
// // @desc Upload a file
// // @access Public
// router.post("/", (req, res) => {
//   uploadSingle(req, res, (err) => {
//     if (err) {
//       return res.status(400).send({ message: err.message || err });
//     }

//     if (!req.file) {
//       return res.status(400).send({ message: "No file selected" });
//     }

//     res.status(200).send({
//       message: "File uploaded successfully",
//       image: `/${req.file.path}`,
//     });
//   });
// });

// export default router;
