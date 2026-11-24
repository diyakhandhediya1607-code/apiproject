import User from "../models/User.js";
import Product from "../models/Product.js";

export const getDashboardStats = async (req, res, next) => {
  try {
    const [totalUsers, activeUsers, totalProducts, activeProducts, inventory, recentUsers, recentProducts] = await Promise.all([
      User.countDocuments(), User.countDocuments({ status: "Active" }),
      Product.countDocuments(), Product.countDocuments({ status: "Active" }),
      Product.find().select("price stock category"),
      User.find().sort({ createdAt: -1 }).limit(5).select("name email status createdAt"),
      Product.find().sort({ createdAt: -1 }).limit(5).select("name category price status createdAt")
    ]);
    const totalInventoryValue = inventory.reduce((sum, item) => sum + item.price * item.stock, 0);
    const categoryCounts = inventory.reduce((acc, item) => {
      const category = item.category || "Other";
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {});
    const categories = Object.entries(categoryCounts).map(([name, count]) => ({ name, count }));
    res.json({ totalUsers, activeUsers, totalProducts, activeProducts, totalInventoryValue, categories, recentUsers, recentProducts });
  } catch (error) { next(error); }
};
