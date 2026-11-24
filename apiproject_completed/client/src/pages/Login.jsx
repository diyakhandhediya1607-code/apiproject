
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, Mail, Lock, User, LogIn } from "lucide-react";
import "./Login.css";

const API = "http://localhost:5000/api/auth";

function Login() {
  const navigate = useNavigate();

  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isRegister) {
        await axios.post(`${API}/register`, form);

        setIsRegister(false);
        setForm({
          name: "",
          email: form.email,
          password: ""
        });

        alert("Registration successful. Please login.");
      } else {
        const response = await axios.post(`${API}/login`, {
          email: form.email,
          password: form.password
        });

        localStorage.setItem("adminToken", response.data.token);
        localStorage.setItem(
          "adminInfo",
          JSON.stringify(response.data.admin)
        );

        navigate("/", { replace: true });
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">

        <div className="login-logo">
          <ShieldCheck size={35} />
        </div>

        <h1>{isRegister ? "Create Admin Account" : "Welcome Back!"}</h1>

        <p className="login-subtitle">
          {isRegister
            ? "Register your administrator account"
            : "Login to your admin dashboard"}
        </p>

        {error && <div className="login-error">{error}</div>}

        <form onSubmit={handleSubmit}>

          {isRegister && (
            <div className="login-input-group">
              <User size={19} />
              <input
                type="text"
                placeholder="Full Name"
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
                required
              />
            </div>
          )}

          <div className="login-input-group">
            <Mail size={19} />
            <input
              type="email"
              placeholder="Email Address"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
              required
            />
          </div>

          <div className="login-input-group">
            <Lock size={19} />
            <input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
              minLength={8}
              required
            />
          </div>

          <button className="login-submit" disabled={loading}>
            <LogIn size={18} />
            {loading
              ? "Please wait..."
              : isRegister
                ? "Create Account"
                : "Login"}
          </button>
        </form>

        <div className="login-switch">
          {isRegister
            ? "Already have an account?"
            : "Don't have an admin account?"}

          <button
            type="button"
            onClick={() => {
              setIsRegister(!isRegister);
              setError("");
            }}
          >
            {isRegister ? "Login" : "Register"}
          </button>
        </div>

        <p className="login-footer">
          <ShieldCheck size={14} />
          Secure Admin Access
        </p>

      </div>
    </div>
  );
}

export default Login;
