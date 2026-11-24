import { LayoutDashboard, Users, Package, Settings, LogOut } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();
  const logout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminInfo");
    navigate("/login", { replace: true });
  };
  return <aside className="sidebar">
    <h2 className="logo">Admin<span>Pro</span></h2>
    <p className="menu-title">MENU</p>
    <NavLink to="/" end className={({ isActive }) => `menu-link ${isActive ? "active" : ""}`}><LayoutDashboard size={20}/>Dashboard</NavLink>
    <NavLink to="/users" className={({ isActive }) => `menu-link ${isActive ? "active" : ""}`}><Users size={20}/>Users</NavLink>
    <NavLink to="/products" className={({ isActive }) => `menu-link ${isActive ? "active" : ""}`}><Package size={20}/>Products</NavLink>
    <div className="sidebar-bottom">
      <NavLink to="/settings" className={({ isActive }) => `menu-link ${isActive ? "active" : ""}`}><Settings size={20}/>Settings</NavLink>
      <button type="button" className="menu-link logout-link" onClick={logout}><LogOut size={20}/>Logout</button>
    </div>
  </aside>;
}
