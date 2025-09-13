import asyncHandler from "../middlewares/asyncHandler.js";
import Product from "../models/productModel.js";

// @desc    Create a new product
const addProduct = asyncHandler(async (req, res) => {
  try {
    const {
      name,
      image,
      brand,
      category,
      description,
      price,
      quantity,
      countInStock,
    } = req.fields;

    switch (true) {
      case !name:
        return res.status(400).json({ message: "Name is required" });
      case !image:
        return res.status(400).json({ message: "Image is required" });
      case !brand:
        return res.status(400).json({ message: "Brand is required" });
      case !category:
        return res.status(400).json({ message: "Category is required" });
      case !description:
        return res.status(400).json({ message: "Description is required" });
      case !price:
        return res.status(400).json({ message: "Price is required" });
      case !quantity:
        return res.status(400).json({ message: "Quantity  is required" });
      case !countInStock:
        return res.status(400).json({ message: "CountIn stock is required" });
    }

    const product = new Product({ ...req.fields });

    await product.save();
    res.status(201).json(product);
  } catch (error) {
    console.error(error);
    res.status(400);
  }
});

const updateProductDetails = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      image,
      brand,
      category,
      description,
      price,
      quantity,
      countInStock,
    } = req.fields;

    switch (true) {
      case !name:
        return res.status(400).json({ message: "Name is required" });
      case !image:
        return res.status(400).json({ message: "Image is required" });
      case !brand:
        return res.status(400).json({ message: "Brand is required" });
      case !category:
        return res.status(400).json({ message: "Category is required" });
      case !description:
        return res.status(400).json({ message: "Description is required" });
      case !price:
        return res.status(400).json({ message: "Price is required" });
      case !quantity:
        return res.status(400).json({ message: "Quantity is required" });
      case !countInStock:
        return res.status(400).json({ message: "Count in stock is required" });
    }

    const product = await Product.findByIdAndUpdate(
      id,
      { ...req.fields },
      { new: true }
    );
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await product.save();
    res.status(200).json(product);
  } catch (error) {
    console.error(error);
    res.status(400);
  }
});

const deleteProduct = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(204).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

const fetchProducts = asyncHandler(async (req, res) => {
  try {
    const pageSize = 6;
    const keywords = req.query.keywords
      ? { name: { $regex: req.query.keywords, $options: "i" } }
      : {};

    const count = await Product.countDocuments({ ...keywords });
    const page = Number(req.query.page) || 1;

    const products = await Product.find({ ...keywords })
      .limit(pageSize)
      .skip(pageSize * (page - 1));
    res.status(200).json({
      products,
      page,
      pages: Math.ceil(count / pageSize),
      hasMore: false,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

const fetchProductById = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }
    res.status(200).json(product);
  } catch (error) {
    console.error(error);
    res.status(404).json({ error: "Server error" });
  }
});

const fetchAllProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find({})
      .populate("category")
      .limit(12)
      .sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

const addProductReview = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product) {
      const alreadyReviewed = product.reviews.find(
        (r) => r.user.toString() === req.user._id.toString()
      );

      if (alreadyReviewed) {
        res.status(400);
        throw new Error("Product already reviewed");
      }

      const review = {
        user: req.user._id,
        name: req.user.username,
        rating: Number(rating),
        comment,
      };

      product.reviews.push(review);
      product.numReviews = product.reviews.length;
      product.rating =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length;

      await product.save();
      res.status(201).json({ message: "Review added" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

const fetchTopProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find({}).sort({ rating: -1 }).limit(5);
    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(400).json(error.message);
  }
});

const fetchNewProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find({}).sort({ _id: -1 }).limit(5); // .sort({ createdAt: -1 }) can be used if createdAt field is indexed
    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(400).json(error.message);
  }
});

export {
  addProduct,
  updateProductDetails,
  deleteProduct,
  fetchProducts,
  fetchProductById,
  fetchAllProducts,
  addProductReview,
  fetchTopProducts,
  fetchNewProducts,
};
