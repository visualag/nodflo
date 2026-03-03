"use client";
import { useState, useEffect } from "react";

const EMPTY = { name: "", logo: "", website: "", tier: "partner", order: 0 };

export default function AdminSponsors() {
    const [sponsors, setSponsors] = useState<any[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState<any>(null);
    const [form, setForm] = useState<any>(EMPTY);
    const [saving, setSaving] = useState(false);

    async function load() {
        const data = await fetch("/api/sponsors").then((r) => r.json());
        setSponsors(Array.isArray(data) ? data : []);
    }
    useEffect(() => { load(); }, []);

    function openNew() { setForm(EMPTY); setEditing(null); setShowModal(true); }
    function openEdit(s: any) {
        setForm({ name: s.name || "", logo: s.logo || "", website: s.website || "", tier: s.tier || "partner", order: s.order || 0 });
        setEditing(s); setShowModal(true);
    }

    async function save() {
        setSaving(true);
        if (editing) await fetch(`/api/sponsors/${editing._id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
        else await fetch("/api/sponsors", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
        setSaving(false); setShowModal(false); load();
    }

    async function del(id: string) {
        if (!confirm("Remove sponsor?")) return;
        await fetch(`/api/sponsors/${id}`, { method: "DELETE" });
        load();
    }

    return (
        <>
            <div className="admin-header">
                <h1>Sponsors</h1>
                <button className="btn btn--dark" onClick={openNew}>+ Add Sponsor</button>
            </div>
            <div className="admin-card" style={{ padding: 0 }}>
                <table className="admin-table">
                    <thead><tr><th>Name</th><th>Tier</th><th>Website</th><th>Actions</th></tr></thead>
                    <tbody>
                        {sponsors.length === 0 && (
                            <tr><td colSpan={4} style={{ textAlign: "center", color: "var(--grey-600)", fontStyle: "italic" }}>No sponsors yet.</td></tr>
                        )}
                        {sponsors.map((s) => (
                            <tr key={s._id}>
                                <td style={{ fontFamily: "var(--font-serif)" }}>{s.name}</td>
                                <td><span className="tag tag--upcoming" style={{ textTransform: "capitalize" }}>{s.tier}</span></td>
                                <td>{s.website ? <a href={s.website} target="_blank" style={{ color: "var(--accent-dark)", fontSize: "0.8rem" }}>↗ Site</a> : "—"}</td>
                                <td>
                                    <div style={{ display: "flex", gap: 8 }}>
                                        <button onClick={() => openEdit(s)} className="btn btn--outline" style={{ padding: "6px 14px", fontSize: "0.7rem" }}>Edit</button>
                                        <button onClick={() => del(s._id)} style={{ padding: "6px 14px", fontSize: "0.7rem", border: "1px solid #e74c3c", color: "#e74c3c", cursor: "pointer", background: "transparent" }}>Delete</button>
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
                        <div className="modal__title">{editing ? "Edit Sponsor" : "Add Sponsor"}</div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label className="form-label">Name *</label>
                                    <input className="form-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Tier</label>
                                    <select className="form-select" value={form.tier} onChange={(e) => setForm({ ...form, tier: e.target.value })}>
                                        <option value="gold">Gold</option>
                                        <option value="silver">Silver</option>
                                        <option value="partner">Partner</option>
                                    </select>
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Logo URL</label>
                                <input className="form-input" placeholder="https://..." value={form.logo} onChange={(e) => setForm({ ...form, logo: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Website</label>
                                <input className="form-input" type="url" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} />
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
