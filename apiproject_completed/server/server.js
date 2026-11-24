import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import authMiddleware from "./middleware/authMiddleware.js";
import errorMiddleware from "./middleware/errorMiddleware.js";

dotenv.config();
const app = express();
const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:5173").split(",").map((v) => v.trim());
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => res.json({ message: "Admin Dashboard API is running." }));
app.get("/api/health", (req, res) => res.json({ status: "ok", database: mongoose.connection.readyState === 1 ? "connected" : "disconnected" }));
app.use("/api/auth", authRoutes);
app.use("/api", authMiddleware);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use((req, res) => res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` }));
app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;
const start = async () => {
  try {
    if (!process.env.MONGO_URI) throw new Error("MONGO_URI is missing in .env");
    if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is missing in .env");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected Successfully");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
};
start();
