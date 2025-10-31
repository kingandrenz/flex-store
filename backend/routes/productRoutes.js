import express from "express";
// import formidable from "express-formidable";
const router = express.Router();

// controllers
import {
  addProduct,
  addProductReview,
  deleteProduct,
  fetchAllProducts,
  fetchNewProducts,
  fetchProductById,
  fetchProducts,
  fetchTopProducts,
  filteredProducts,
  updateProductDetails,
} from "../controllers/productController.js";

// middlewares
import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";
import checkId from "../middlewares/checkId.js";

router
  .route("/")
  .get(fetchProducts)
  .post(authenticate, authorizeAdmin, addProduct);

router.route("/allproducts").get(fetchAllProducts);

// @reviews
router.route("/:id/reviews").post(authenticate, checkId, addProductReview);

// @fetch top products
// router.route("/top").get(fetchTopProducts);
router.get("/top", fetchTopProducts);
router.get("/new", fetchNewProducts);

router
  .route("/:id")
  .get(checkId, fetchProductById)
  .put(authenticate, authorizeAdmin, updateProductDetails)
  .delete(authenticate, authorizeAdmin, checkId, deleteProduct);

router.route("/filtered-products").post(filteredProducts);

export default router;
