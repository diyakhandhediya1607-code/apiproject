import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";

const createToken = (admin) => jwt.sign(
  { id: admin._id.toString(), role: admin.role },
  process.env.JWT_SECRET,
  { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
);

export const registerAdmin = async (req, res, next) => {
  try {
    const name = String(req.body.name || "").trim();
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "");

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required." });
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ message: "Enter a valid email address." });
    }
    if (password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters." });
    }

    // Public registration is only available for the first admin account.
    if (await Admin.exists({})) {
      return res.status(403).json({ message: "Admin registration is closed. Ask an existing administrator." });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const admin = await Admin.create({ name, email, password: hashedPassword });
    return res.status(201).json({
      message: "Admin registered successfully.",
      admin: { id: admin._id, name: admin.name, email: admin.email, role: admin.role }
    });
  } catch (error) {
    if (error.code === 11000) return res.status(409).json({ message: "An admin with this email already exists." });
    next(error);
  }
};

export const loginAdmin = async (req, res, next) => {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "");
    if (!email || !password) return res.status(400).json({ message: "Email and password are required." });

    const admin = await Admin.findOne({ email });
    if (!admin || !(await bcrypt.compare(password, admin.password))) {
      return res.status(401).json({ message: "Invalid email or password." });
    }
    if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is not configured.");

    return res.json({
      message: "Login successful.",
      token: createToken(admin),
      admin: { id: admin._id, name: admin.name, email: admin.email, role: admin.role }
    });
  } catch (error) { next(error); }
};

export const getCurrentAdmin = async (req, res, next) => {
  try {
    const admin = await Admin.findById(req.admin.id).select("name email role createdAt");
    if (!admin) return res.status(404).json({ message: "Admin account not found." });
    res.json({ admin });
  } catch (error) { next(error); }
};
