import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, UserRound, LogOut } from "lucide-react";
import api from "../api";

export default function Settings() {
  const [admin, setAdmin] = useState(() => {
    try { return JSON.parse(localStorage.getItem("adminInfo") || "{}"); } catch { return {}; }
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    api.get("/auth/me").then(({ data }) => {
      setAdmin(data.admin);
      localStorage.setItem("adminInfo", JSON.stringify(data.admin));
    }).catch(() => setMessage("Could not refresh administrator details."));
  }, []);
  const logout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminInfo");
    navigate("/login", { replace: true });
  };
  return <section className="settings-page">
    <h1>Settings</h1><p>Administrator account details and session settings.</p>
    {message && <div className="alert-error">{message}</div>}
    <div className="settings-card"><div className="settings-card-title"><UserRound/><div><h2>Administrator Profile</h2><p>Account currently signed in</p></div></div>
      <div className="settings-detail"><span>Name</span><strong>{admin.name || "—"}</strong></div>
      <div className="settings-detail"><span>Email</span><strong>{admin.email || "—"}</strong></div>
      <div className="settings-detail"><span>Role</span><strong>{admin.role || "Admin"}</strong></div>
      <div className="settings-secure"><ShieldCheck size={18}/> Your dashboard pages are protected by JWT authentication.</div>
      <button className="logout-button" onClick={logout}><LogOut size={17}/> Logout</button>
    </div>
  </section>;
}
