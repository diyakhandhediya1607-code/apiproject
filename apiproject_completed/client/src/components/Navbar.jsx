import { Bell, UserCircle } from "lucide-react";
import { useLocation } from "react-router-dom";

const titles = { "/": "Dashboard", "/users": "Users", "/products": "Products", "/settings": "Settings" };
export default function Navbar() {
  const location = useLocation();
  let admin = {};
  try { admin = JSON.parse(localStorage.getItem("adminInfo") || "{}"); } catch { admin = {}; }
  const title = titles[location.pathname] || "Admin Dashboard";
  return <header className="navbar">
    <div><h2>{title}</h2><p>Welcome back, {admin.name || "Admin"}!</p></div>
    <div className="navbar-right"><Bell size={21}/><div className="admin-profile"><UserCircle size={22}/><span>{admin.name || "Admin"}</span></div></div>
  </header>;
}
