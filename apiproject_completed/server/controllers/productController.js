import mongoose from "mongoose";
import Product from "../models/Product.js";

const validateProduct = (body) => {
  const name = String(body.name || "").trim();
  const category = String(body.category || "").trim();
  const price = Number(body.price);
  const stock = Number(body.stock ?? 0);
  if (!name || !category) return "Product name and category are required.";
  if (!Number.isFinite(price) || price < 0) return "Price must be a valid non-negative number.";
  if (!Number.isInteger(stock) || stock < 0) return "Stock must be a non-negative whole number.";
  if (body.status !== undefined && !["Active", "Inactive"].includes(body.status)) return "Status must be Active or Inactive.";
  return null;
};

export const getProducts = async (req, res, next) => {
  try { res.json(await Product.find().sort({ createdAt: -1 })); }
  catch (error) { next(error); }
};

export const createProduct = async (req, res, next) => {
  try {
    const issue = validateProduct(req.body);
    if (issue) return res.status(400).json({ message: issue });
    const product = await Product.create({
      name: String(req.body.name).trim(), description: req.body.description || "",
      price: Number(req.body.price), category: String(req.body.category).trim(),
      stock: Number(req.body.stock ?? 0), status: req.body.status || "Active"
    });
    res.status(201).json(product);
  } catch (error) { next(error); }
};

export const updateProduct = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: "Invalid product ID." });
    const current = await Product.findById(req.params.id);
    if (!current) return res.status(404).json({ message: "Product not found." });
    const merged = { ...current.toObject(), ...req.body };
    const issue = validateProduct(merged);
    if (issue) return res.status(400).json({ message: issue });
    const updates = {};
    for (const key of ["name", "description", "price", "category", "stock", "status"]) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }
    if (updates.name !== undefined) updates.name = String(updates.name).trim();
    if (updates.category !== undefined) updates.category = String(updates.category).trim();
    if (updates.price !== undefined) updates.price = Number(updates.price);
    if (updates.stock !== undefined) updates.stock = Number(updates.stock);
    const product = await Product.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
    res.json(product);
  } catch (error) { next(error); }
};

export const deleteProduct = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: "Invalid product ID." });
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found." });
    res.json({ message: "Product deleted successfully." });
  } catch (error) { next(error); }
};
