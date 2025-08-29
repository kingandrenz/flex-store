import Category from "../models/categoryModel.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import { json } from "express";

const createCategory = asyncHandler(async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.json({ error: "Name is required!" });
    }

    const existingCategory = await Category.findOne({
      name: name.toLowerCase(),
    });

    if (existingCategory) {
      return res, json({ error: "Category name already exist!" });
    }

    const category = await new Category({ name: name.toLowerCase() }).save();
    return res.status(201).json(category);
  } catch (error) {
    console.error(error);
    return res.status(404).json(error);
  }
});

const updateCategory = asyncHandler(async (req, res) => {
  try {
    const { name } = req.body;
    const { categoryId } = req.params;

    // Find category by ID
    const category = await Category.findById(categoryId);

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    // Update name if provided
    category.name = name?.toLowerCase() || category.name;

    // Save updated category
    const updatedCategory = await category.save();

    res.status(200).json(updatedCategory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

const deleteCategory = asyncHandler(async (req, res) => {
  try {
    const remove = await Category.findByIdAndDelete(req.params.categoryId);
    res.json(remove);
  } catch (error) {
    console.error(error);
    res.status(500).json("Internal server Error");
  }
});

const listCategory = asyncHandler(async (req, res) => {
  try {
    const all = await Category.find({});
    res.json(all);
  } catch (error) {
    console.error(error);
    res.status(400).json(error.message);
  }
});

const readCategory = asyncHandler(async (req, res) => {
  try {
    const category = await Category.findOne({ _id: req.params.id });
    res.json(category);
  } catch (error) {
    console.error(error);
    return res.status(400).json(error.message);
  }
});

export {
  createCategory,
  updateCategory,
  deleteCategory,
  listCategory,
  readCategory,
};
