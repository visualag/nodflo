"use client";
import { useState, useEffect } from "react";

const EMPTY = { title: "", slug: "", description: "", requirements: "", deadline: "", isActive: true, coverImage: "" };

function slugify(str: string) {
    return str.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

export default function AdminOpenCalls() {
    const [calls, setCalls] = useState<any[]>([]);
    const [applications, setApplications] = useState<any[]>([]);
    const [selectedCall, setSelectedCall] = useState<any>(null);
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState<any>(null);
    const [form, setForm] = useState(EMPTY);
    const [saving, setSaving] = useState(false);

    async function load() {
        const data = await fetch("/api/open-calls").then((r) => r.json());
        setCalls(Array.isArray(data) ? data : []);
    }

    async function loadApplications(call: any) {
        setSelectedCall(call);
        const data = await fetch(`/api/open-calls/${call._id}/apply`).then((r) => r.json());
        setApplications(Array.isArray(data) ? data : []);
    }

    useEffect(() => { load(); }, []);

    function openNew() { setForm(EMPTY); setEditing(null); setShowModal(true); }
    function openEdit(c: any) {
        setForm({
            title: c.title || "", slug: c.slug || "", description: c.description || "",
            requirements: c.requirements || "", deadline: c.deadline?.slice(0, 10) || "",
            isActive: c.isActive ?? true, coverImage: c.coverImage || ""
        });
        setEditing(c); setShowModal(true);
    }

    async function save() {
        setSaving(true);
        const payload = { ...form, slug: form.slug || slugify(form.title) };
        if (editing) {
            await fetch(`/api/open-calls/${editing._id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
        } else {
            await fetch("/api/open-calls", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
        }
        setSaving(false); setShowModal(false); load();
    }

    async function del(id: string) {
        if (!confirm("Delete this open call?")) return;
        await fetch(`/api/open-calls/${id}`, { method: "DELETE" });
        load();
    }

    return (
        <>
            <div className="admin-header">
                <h1>Open Calls</h1>
                <button className="btn btn--dark" onClick={openNew}>+ New Open Call</button>
            </div>

            <div className="admin-card" style={{ padding: 0, marginBottom: 32 }}>
                <table className="admin-table">
                    <thead><tr><th>Title</th><th>Deadline</th><th>Status</th><th>Actions</th></tr></thead>
                    <tbody>
                        {calls.length === 0 && (
                            <tr><td colSpan={4} style={{ textAlign: "center", color: "var(--grey-600)", fontStyle: "italic" }}>No open calls yet.</td></tr>
                        )}
                        {calls.map((c) => (
                            <tr key={c._id}>
                                <td style={{ fontFamily: "var(--font-serif)" }}>{c.title}</td>
                                <td style={{ fontSize: "0.8rem" }}>{c.deadline ? new Date(c.deadline).toLocaleDateString("en-GB") : "—"}</td>
                                <td><span className={`tag ${c.isActive ? "tag--active" : "tag--inactive"}`}>{c.isActive ? "Active" : "Closed"}</span></td>
                                <td>
                                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                                        <button onClick={() => loadApplications(c)} className="btn btn--outline" style={{ padding: "6px 14px", fontSize: "0.7rem" }}>View Applications</button>
                                        <button onClick={() => openEdit(c)} className="btn btn--outline" style={{ padding: "6px 14px", fontSize: "0.7rem" }}>Edit</button>
                                        <button onClick={() => del(c._id)} style={{ padding: "6px 14px", fontSize: "0.7rem", border: "1px solid #e74c3c", color: "#e74c3c", cursor: "pointer", background: "transparent" }}>Delete</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {selectedCall && (
                <div>
                    <div className="admin-header" style={{ marginBottom: 24 }}>
                        <h2 style={{ fontFamily: "var(--font-serif)", fontWeight: 400, fontSize: "1.5rem" }}>
                            Applications for: {selectedCall.title}
                        </h2>
                        <button onClick={() => { setSelectedCall(null); setApplications([]); }} style={{ fontSize: "0.75rem", cursor: "pointer", opacity: 0.5 }}>✕ Close</button>
                    </div>
                    <div className="admin-card" style={{ padding: 0 }}>
                        <table className="admin-table">
                            <thead><tr><th>Artist</th><th>Email</th><th>Portfolio</th><th>Submitted</th><th>Status</th></tr></thead>
                            <tbody>
                                {applications.length === 0 && (
                                    <tr><td colSpan={5} style={{ textAlign: "center", color: "var(--grey-600)", fontStyle: "italic" }}>No applications yet.</td></tr>
                                )}
                                {applications.map((a) => (
                                    <tr key={a._id}>
                                        <td>{a.artistName}</td>
                                        <td><a href={`mailto:${a.email}`} style={{ color: "var(--grey-400)" }}>{a.email}</a></td>
                                        <td>{a.portfolioUrl ? <a href={a.portfolioUrl} target="_blank" rel="noopener" style={{ color: "var(--accent-dark)", fontSize: "0.8rem" }}>View</a> : "—"}</td>
                                        <td style={{ fontSize: "0.8rem" }}>{new Date(a.createdAt).toLocaleDateString("en-GB")}</td>
                                        <td><span className="tag tag--upcoming">{a.status}</span></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal__title">{editing ? "Edit Open Call" : "New Open Call"}</div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                            <div className="form-group">
                                <label className="form-label">Title *</label>
                                <input className="form-input" value={form.title}
                                    onChange={(e) => setForm({ ...form, title: e.target.value, slug: slugify(e.target.value) })} />
                            </div>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label className="form-label">Deadline</label>
                                    <input className="form-input" type="date" value={form.deadline}
                                        onChange={(e) => setForm({ ...form, deadline: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Status</label>
                                    <select className="form-select" value={form.isActive ? "active" : "closed"}
                                        onChange={(e) => setForm({ ...form, isActive: e.target.value === "active" })}>
                                        <option value="active">Active</option>
                                        <option value="closed">Closed</option>
                                    </select>
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Description</label>
                                <textarea className="form-textarea" rows={4} value={form.description}
                                    onChange={(e) => setForm({ ...form, description: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Requirements</label>
                                <textarea className="form-textarea" rows={4} value={form.requirements}
                                    onChange={(e) => setForm({ ...form, requirements: e.target.value })} />
                            </div>
                            <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
                                <button onClick={() => setShowModal(false)} className="btn btn--outline">Cancel</button>
                                <button onClick={save} disabled={saving} className="btn btn--dark">{saving ? "Saving..." : editing ? "Update" : "Create"}</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
