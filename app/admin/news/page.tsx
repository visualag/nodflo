"use client";
import { useState, useEffect } from "react";

const EMPTY = { title: "", date: "", excerpt: "", content: "", link: "", image: "", source: "" };

export default function AdminNews() {
    const [news, setNews] = useState<any[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState<any>(null);
    const [form, setForm] = useState<any>(EMPTY);
    const [saving, setSaving] = useState(false);

    async function load() {
        const data = await fetch("/api/news").then((r) => r.json());
        setNews(Array.isArray(data) ? data : []);
    }
    useEffect(() => { load(); }, []);

    function openNew() { setForm(EMPTY); setEditing(null); setShowModal(true); }
    function openEdit(n: any) {
        setForm({ title: n.title || "", date: n.date?.slice(0, 10) || "", excerpt: n.excerpt || "", content: n.content || "", link: n.link || "", image: n.image || "", source: n.source || "" });
        setEditing(n); setShowModal(true);
    }

    async function save() {
        setSaving(true);
        if (editing) await fetch(`/api/news/${editing._id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
        else await fetch("/api/news", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
        setSaving(false); setShowModal(false); load();
    }

    async function del(id: string) {
        if (!confirm("Delete news item?")) return;
        await fetch(`/api/news/${id}`, { method: "DELETE" });
        load();
    }

    return (
        <>
            <div className="admin-header">
                <h1>News & Press</h1>
                <button className="btn btn--dark" onClick={openNew}>+ Add News</button>
            </div>
            <div className="admin-card" style={{ padding: 0 }}>
                <table className="admin-table">
                    <thead><tr><th>Title</th><th>Source</th><th>Date</th><th>Actions</th></tr></thead>
                    <tbody>
                        {news.length === 0 && (
                            <tr><td colSpan={4} style={{ textAlign: "center", color: "var(--grey-600)", fontStyle: "italic" }}>No news yet.</td></tr>
                        )}
                        {news.map((n) => (
                            <tr key={n._id}>
                                <td style={{ fontFamily: "var(--font-serif)" }}>{n.title}</td>
                                <td style={{ fontSize: "0.8rem" }}>{n.source || "—"}</td>
                                <td style={{ fontSize: "0.8rem", color: "var(--grey-600)" }}>
                                    {n.date ? new Date(n.date).toLocaleDateString("en-GB") : "—"}
                                </td>
                                <td>
                                    <div style={{ display: "flex", gap: 8 }}>
                                        <button onClick={() => openEdit(n)} className="btn btn--outline" style={{ padding: "6px 14px", fontSize: "0.7rem" }}>Edit</button>
                                        <button onClick={() => del(n._id)} style={{ padding: "6px 14px", fontSize: "0.7rem", border: "1px solid #e74c3c", color: "#e74c3c", cursor: "pointer", background: "transparent" }}>Delete</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal__title">{editing ? "Edit News" : "Add News"}</div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                            <div className="form-group">
                                <label className="form-label">Title *</label>
                                <input className="form-input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                            </div>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label className="form-label">Date *</label>
                                    <input className="form-input" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Source</label>
                                    <input className="form-input" placeholder="e.g. Artforum, Le Monde..." value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })} />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Link</label>
                                <input className="form-input" type="url" value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Cover Image</label>
                                {form.image && <img src={form.image} style={{ width: "100%", height: "120px", objectFit: "cover", marginBottom: "8px" }} />}
                                <input type="file" onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        const fd = new FormData();
                                        fd.append("file", file);
                                        fd.append("folder", "news");
                                        const res = await fetch("/api/upload", { method: "POST", body: fd });
                                        const data = await res.json();
                                        if (data.url) setForm({ ...form, image: data.url });
                                    }
                                }} />
                                <input className="form-input" style={{ marginTop: 8, fontSize: "0.75rem" }} placeholder="Or paste URL..." value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Excerpt (Short Summary)</label>
                                <textarea className="form-textarea" rows={2} value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Full Article Content (HTML supported)</label>
                                <textarea className="form-textarea" rows={8} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
                            </div>
                            <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
                                <button onClick={() => setShowModal(false)} className="btn btn--outline">Cancel</button>
                                <button onClick={save} disabled={saving} className="btn btn--dark">{saving ? "Saving..." : editing ? "Update" : "Add"}</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
