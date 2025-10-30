import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";

// 1. Configure Cloudinary using environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 2. Define the Cloudinary storage engine
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "flex-store-products", // Folder name in your Cloudinary account
    allowed_formats: ["jpeg", "png", "jpg", "webp"],
    // Optional: set a dynamic public ID based on the original filename
    public_id: (req, file) => file.fieldname + "-" + Date.now(),
  },
});

// 3. Define the file filter (same logic as before)
const fileFilter = (req, file, cb) => {
  const allowedFileTypes = /\.(jpe?g|png|webp)$/i;
  const mimeTypes = /image\/(jpe?g|png|webp)/i;

  const extname = path.extname(file.originalname);
  const mimetype = file.mimetype;

  if (allowedFileTypes.test(extname) && mimeTypes.test(mimetype)) {
    return cb(null, true);
  } else {
    cb("Invalid file type. Only JPEG, PNG and WEBP files are allowed.");
  }
};

// 4. Create the final multer upload instance
const productUpload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 1024 * 1024 * 5 }, // 5 MB limit
});

export default productUpload;
