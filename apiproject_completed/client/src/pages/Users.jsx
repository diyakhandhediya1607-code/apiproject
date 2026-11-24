import { useCallback, useEffect, useMemo, useState } from "react";
import { Pencil, Trash2, X, Search, RefreshCw } from "lucide-react";
import api from "../api";

const initialForm = { name: "", email: "", role: "User", status: "Active" };

export default function Users() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const fetchUsers = useCallback(async () => {
    setLoading(true); setError("");
    try { const { data } = await api.get("/users"); setUsers(data); }
    catch (err) { setError(err.response?.data?.message || "Users load failed."); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const filteredUsers = useMemo(() => users.filter((u) =>
    `${u.name} ${u.email} ${u.role} ${u.status}`.toLowerCase().includes(search.toLowerCase())
  ), [users, search]);

  const submit = async (event) => {
    event.preventDefault(); setSaving(true); setError(""); setNotice("");
    try {
      if (editingId) await api.put(`/users/${editingId}`, form);
      else await api.post("/users", form);
      setNotice(editingId ? "User updated successfully." : "User added successfully.");
      setForm(initialForm); setEditingId(null); await fetchUsers();
    } catch (err) { setError(err.response?.data?.message || "Could not save user."); }
    finally { setSaving(false); }
  };

  const edit = (user) => {
    setForm({ name: user.name, email: user.email, role: user.role, status: user.status });
    setEditingId(user._id); setNotice(""); setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const remove = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try { await api.delete(`/users/${id}`); setNotice("User deleted successfully."); await fetchUsers(); }
    catch (err) { setError(err.response?.data?.message || "Delete failed."); }
  };

  return <section className="users-page">
    <div className="page-heading-row"><div><h1>Manage Users</h1><p>Add, edit, search and manage users.</p></div><button type="button" className="secondary-btn" onClick={fetchUsers}><RefreshCw size={16}/> Refresh</button></div>
    {error && <div className="alert-error">{error}</div>}{notice && <div className="alert-success">{notice}</div>}
    <form onSubmit={submit} className="user-form">
      <input placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} minLength={2} maxLength={80} required />
      <input type="email" placeholder="Email address" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
      <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}><option>User</option><option>Manager</option><option>Admin</option></select>
      <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}><option>Active</option><option>Inactive</option></select>
      <button type="submit" disabled={saving}>{saving ? "Saving..." : editingId ? "Update User" : "Add User"}</button>
      {editingId && <button type="button" className="secondary-btn" onClick={() => { setEditingId(null); setForm(initialForm); }}> <X size={16}/> Cancel</button>}
    </form>
    <div className="table-toolbar"><div className="table-search"><Search size={17}/><input placeholder="Search users..." value={search} onChange={(e) => setSearch(e.target.value)} /></div><span>{filteredUsers.length} user(s)</span></div>
    <div className="users-table"><table><thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Actions</th></tr></thead><tbody>
      {loading ? <tr><td colSpan="5">Loading users...</td></tr> : filteredUsers.length === 0 ? <tr><td colSpan="5">No users found.</td></tr> : filteredUsers.map((user) => <tr key={user._id}><td>{user.name}</td><td>{user.email}</td><td>{user.role}</td><td><span className={`status-badge ${user.status === "Active" ? "active" : "inactive"}`}>{user.status}</span></td><td className="action-cell"><button aria-label="Edit user" onClick={() => edit(user)}><Pencil size={16}/></button><button aria-label="Delete user" onClick={() => remove(user._id)}><Trash2 size={16}/></button></td></tr>)}
    </tbody></table></div>
  </section>;
}
