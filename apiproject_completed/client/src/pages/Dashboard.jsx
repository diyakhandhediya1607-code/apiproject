
import { useEffect, useState } from "react";
import api from "../api";
import {
  Users,
  Package,
  UserCheck,
  IndianRupee,
  RefreshCw,
  Activity,
  TrendingUp,
  ShoppingBag
} from "lucide-react";
import "./Dashboard.css";

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchStats = async () => {
    try {
      setError("");
      const response = await api.get("/dashboard/stats");
      setStats(response.data);
    } catch (err) {
      setError("Dashboard data load થઈ શક્યો નથી.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(amount || 0);

  if (loading) {
    return <div className="dashboard-loading">Loading Dashboard...</div>;
  }

  if (error) {
    return (
      <div className="dashboard-error">
        <p>{error}</p>
        <button onClick={fetchStats}>Try Again</button>
      </div>
    );
  }

  const cards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      color: "blue"
    },
    {
      title: "Active Users",
      value: stats.activeUsers,
      icon: UserCheck,
      color: "green"
    },
    {
      title: "Total Products",
      value: stats.totalProducts,
      icon: Package,
      color: "purple"
    },
    {
      title: "Inventory Value",
      value: formatCurrency(stats.totalInventoryValue),
      icon: IndianRupee,
      color: "orange"
    }
  ];

  const maxCategoryCount = Math.max(
    ...(stats.categories || []).map((item) => item.count),
    1
  );

  return (
    <div className="dashboard-container">

      <div className="dashboard-heading">
        <div>
          <h1>Dashboard Overview</h1>
          <p>Welcome back! Here's what's happening in your business.</p>
        </div>

        <button className="refresh-btn" onClick={fetchStats}>
          <RefreshCw size={17} />
          Refresh
        </button>
      </div>

      <div className="stats-grid">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <div className="stat-card" key={card.title}>
              <div className={`stat-icon ${card.color}`}>
                <Icon size={24} />
              </div>

              <div className="stat-info">
                <p>{card.title}</p>
                <h2>{card.value}</h2>
              </div>

              <TrendingUp className="stat-trend" size={20} />
            </div>
          );
        })}
      </div>

      <div className="dashboard-content-grid">

        <div className="dashboard-panel">
          <div className="panel-heading">
            <div>
              <h2>Product Categories</h2>
              <p>Products by category</p>
            </div>
            <ShoppingBag size={22} />
          </div>

          {(stats.categories || []).length === 0 ? (
            <p className="empty-message">No product data available.</p>
          ) : (
            <div className="category-list">
              {stats.categories.map((category) => (
                <div className="category-item" key={category.name}>
                  <div className="category-label">
                    <span>{category.name}</span>
                    <strong>{category.count}</strong>
                  </div>

                  <div className="progress-track">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${
                          (category.count / maxCategoryCount) * 100
                        }%`
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="dashboard-panel">
          <div className="panel-heading">
            <div>
              <h2>Quick Overview</h2>
              <p>Current business summary</p>
            </div>
            <Activity size={22} />
          </div>

          <div className="overview-row">
            <span>Active Products</span>
            <strong>{stats.activeProducts}</strong>
          </div>

          <div className="overview-row">
            <span>Inactive Products</span>
            <strong>
              {stats.totalProducts - stats.activeProducts}
            </strong>
          </div>

          <div className="overview-row">
            <span>Inactive Users</span>
            <strong>
              {stats.totalUsers - stats.activeUsers}
            </strong>
          </div>

          <div className="overview-row">
            <span>Total Categories</span>
            <strong>{(stats.categories || []).length}</strong>
          </div>
        </div>
      </div>

      <div className="dashboard-content-grid">

        <div className="dashboard-panel">
          <div className="panel-heading">
            <div>
              <h2>Recent Users</h2>
              <p>Latest registered users</p>
            </div>
            <Users size={22} />
          </div>

          <div className="recent-list">
            {(stats.recentUsers || []).length === 0 ? (
              <p className="empty-message">No users found.</p>
            ) : (
              stats.recentUsers.map((user) => (
                <div className="recent-item" key={user._id}>
                  <div className="recent-avatar">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>

                  <div className="recent-details">
                    <strong>{user.name}</strong>
                    <span>{user.email}</span>
                  </div>

                  <span className={`status-badge ${
                    user.status === "Active" ? "active" : "inactive"
                  }`}>
                    {user.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="dashboard-panel">
          <div className="panel-heading">
            <div>
              <h2>Recent Products</h2>
              <p>Latest added products</p>
            </div>
            <Package size={22} />
          </div>

          <div className="recent-list">
            {(stats.recentProducts || []).length === 0 ? (
              <p className="empty-message">No products found.</p>
            ) : (
              stats.recentProducts.map((product) => (
                <div className="recent-item" key={product._id}>
                  <div className="recent-avatar product-avatar">
                    <Package size={19} />
                  </div>

                  <div className="recent-details">
                    <strong>{product.name}</strong>
                    <span>{product.category} · ₹{product.price}</span>
                  </div>

                  <span className={`status-badge ${
                    product.status === "Active" ? "active" : "inactive"
                  }`}>
                    {product.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default Dashboard;
