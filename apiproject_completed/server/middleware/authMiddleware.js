import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  const header = req.headers.authorization || "";
  if (!header.startsWith("Bearer ")) return res.status(401).json({ message: "Access denied. Please login." });
  try {
    if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is not configured.");
    req.admin = jwt.verify(header.slice(7), process.env.JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token. Please login again." });
  }
};
export default authMiddleware;
