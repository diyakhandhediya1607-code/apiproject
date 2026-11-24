import { useCallback, useEffect, useMemo, useState } from "react";
import { Pencil, Trash2, X, Search, RefreshCw } from "lucide-react";
import api from "../api";

const initialForm = { name: "", description: "", price: "", category: "", stock: 0, status: "Active" };
const money = (value) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }).format(Number(value) || 0);

export default function Products() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const fetchProducts = useCallback(async () => {
    setLoading(true); setError("");
    try { const { data } = await api.get("/products"); setProducts(data); }
    catch (err) { setError(err.response?.data?.message || "Products load failed."); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { fetchProducts(); }, [fetchProducts]);
  const filteredProducts = useMemo(() => products.filter((p) => `${p.name} ${p.category} ${p.status}`.toLowerCase().includes(search.toLowerCase())), [products, search]);

  const submit = async (event) => {
    event.preventDefault(); setSaving(true); setError(""); setNotice("");
    const payload = { ...form, price: Number(form.price), stock: Number(form.stock) };
    try {
      if (editingId) await api.put(`/products/${editingId}`, payload);
      else await api.post("/products", payload);
      setNotice(editingId ? "Product updated successfully." : "Product added successfully.");
      setForm(initialForm); setEditingId(null); await fetchProducts();
    } catch (err) { setError(err.response?.data?.message || "Could not save product."); }
    finally { setSaving(false); }
  };
  const edit = (product) => {
    setForm({ name: product.name, description: product.description || "", price: product.price, category: product.category, stock: product.stock, status: product.status });
    setEditingId(product._id); setNotice(""); setError(""); window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const remove = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try { await api.delete(`/products/${id}`); setNotice("Product deleted successfully."); await fetchProducts(); }
    catch (err) { setError(err.response?.data?.message || "Delete failed."); }
  };

  return <section className="users-page">
    <div className="page-heading-row"><div><h1>Manage Products</h1><p>Add, edit, search and manage your inventory.</p></div><button type="button" className="secondary-btn" onClick={fetchProducts}><RefreshCw size={16}/> Refresh</button></div>
    {error && <div className="alert-error">{error}</div>}{notice && <div className="alert-success">{notice}</div>}
    <form onSubmit={submit} className="user-form product-form">
      <input placeholder="Product name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
      <input placeholder="Description (optional)" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
      <input type="number" placeholder="Price" min="0" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
      <input placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required />
      <input type="number" placeholder="Stock" min="0" step="1" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} required />
      <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}><option>Active</option><option>Inactive</option></select>
      <button type="submit" disabled={saving}>{saving ? "Saving..." : editingId ? "Update Product" : "Add Product"}</button>
      {editingId && <button type="button" className="secondary-btn" onClick={() => { setEditingId(null); setForm(initialForm); }}><X size={16}/> Cancel</button>}
    </form>
    <div className="table-toolbar"><div className="table-search"><Search size={17}/><input placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} /></div><span>{filteredProducts.length} product(s)</span></div>
    <div className="users-table"><table><thead><tr><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th>Status</th><th>Actions</th></tr></thead><tbody>
      {loading ? <tr><td colSpan="6">Loading products...</td></tr> : filteredProducts.length === 0 ? <tr><td colSpan="6">No products found.</td></tr> : filteredProducts.map((product) => <tr key={product._id}><td>{product.name}</td><td>{product.category}</td><td>{money(product.price)}</td><td>{product.stock}</td><td><span className={`status-badge ${product.status === "Active" ? "active" : "inactive"}`}>{product.status}</span></td><td className="action-cell"><button aria-label="Edit product" onClick={() => edit(product)}><Pencil size={16}/></button><button aria-label="Delete product" onClick={() => remove(product._id)}><Trash2 size={16}/></button></td></tr>)}
    </tbody></table></div>
  </section>;
}
