"use client";
import { useState, useEffect } from "react";

export default function AdminMessages() {
    const [messages, setMessages] = useState<any[]>([]);
    const [selected, setSelected] = useState<any>(null);

    useEffect(() => {
        fetch("/api/contact").then((r) => r.json()).then((d) => setMessages(Array.isArray(d) ? d : []));
    }, []);

    return (
        <>
            <div className="admin-header">
                <h1>Messages</h1>
                <span style={{ fontSize: "0.875rem", color: "var(--grey-600)" }}>
                    {messages.filter((m) => !m.read).length} unread
                </span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: selected ? "1fr 1fr" : "1fr", gap: 24 }}>
                <div className="admin-card" style={{ padding: 0 }}>
                    <table className="admin-table">
                        <thead><tr><th>Name</th><th>Email</th><th>Subject</th><th>Date</th></tr></thead>
                        <tbody>
                            {messages.length === 0 && (
                                <tr><td colSpan={4} style={{ textAlign: "center", color: "var(--grey-600)", fontStyle: "italic" }}>No messages yet.</td></tr>
                            )}
                            {messages.map((m) => (
                                <tr key={m._id} onClick={() => setSelected(m)} style={{ cursor: "pointer", background: !m.read ? "rgba(184,169,139,0.08)" : "transparent" }}>
                                    <td style={{ fontWeight: !m.read ? 500 : 400 }}>{m.name}</td>
                                    <td><a href={`mailto:${m.email}`} style={{ color: "var(--grey-400)", fontSize: "0.85rem" }}>{m.email}</a></td>
                                    <td style={{ fontSize: "0.85rem" }}>{m.subject || "—"}</td>
                                    <td style={{ fontSize: "0.8rem", color: "var(--grey-600)" }}>{new Date(m.createdAt).toLocaleDateString("en-GB")}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {selected && (
                    <div className="admin-card">
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24 }}>
                            <h2 style={{ fontFamily: "var(--font-serif)", fontWeight: 400, fontSize: "1.3rem" }}>Message</h2>
                            <button onClick={() => setSelected(null)} style={{ cursor: "pointer", opacity: 0.5 }}>✕</button>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                            <div>
                                <div className="form-label" style={{ marginBottom: 4 }}>From</div>
                                <div>{selected.name} &lt;<a href={`mailto:${selected.email}`}>{selected.email}</a>&gt;</div>
                            </div>
                            {selected.subject && (
                                <div>
                                    <div className="form-label" style={{ marginBottom: 4 }}>Subject</div>
                                    <div>{selected.subject}</div>
                                </div>
                            )}
                            <div>
                                <div className="form-label" style={{ marginBottom: 4 }}>Message</div>
                                <p style={{ lineHeight: 1.75, whiteSpace: "pre-wrap", background: "var(--cream)", padding: 16, minHeight: 120 }}>
                                    {selected.message}
                                </p>
                            </div>
                            <a href={`mailto:${selected.email}?subject=Re: ${encodeURIComponent(selected.subject || "Your message")}`}
                                className="btn btn--dark" style={{ display: "inline-block", textAlign: "center" }}>
                                Reply by Email →
                            </a>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
