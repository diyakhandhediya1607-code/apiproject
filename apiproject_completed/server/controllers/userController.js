import mongoose from "mongoose";
import User from "../models/User.js";

export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (error) { next(error); }
};

export const createUser = async (req, res, next) => {
  try {
    const { name, email, role = "User", status = "Active" } = req.body;
    if (!String(name || "").trim() || !String(email || "").trim()) {
      return res.status(400).json({ message: "Name and email are required." });
    }
    if (!/^\S+@\S+\.\S+$/.test(String(email).trim())) {
      return res.status(400).json({ message: "Enter a valid email address." });
    }
    const user = await User.create({ name: String(name).trim(), email: String(email).trim().toLowerCase(), role, status });
    res.status(201).json(user);
  } catch (error) {
    if (error.code === 11000) return res.status(409).json({ message: "A user with this email already exists." });
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: "Invalid user ID." });
    const updates = {};
    for (const key of ["name", "email", "role", "status"]) if (req.body[key] !== undefined) updates[key] = req.body[key];
    if (updates.name !== undefined) updates.name = String(updates.name).trim();
    if (updates.email !== undefined) updates.email = String(updates.email).trim().toLowerCase();
    if (updates.email && !/^\S+@\S+\.\S+$/.test(updates.email)) return res.status(400).json({ message: "Enter a valid email address." });
    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
    if (!user) return res.status(404).json({ message: "User not found." });
    res.json(user);
  } catch (error) {
    if (error.code === 11000) return res.status(409).json({ message: "A user with this email already exists." });
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: "Invalid user ID." });
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found." });
    res.json({ message: "User deleted successfully." });
  } catch (error) { next(error); }
};
