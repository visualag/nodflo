"use client";
import { useState, useEffect } from "react";

export default function AdminNewsletter() {
    const [subscribers, setSubscribers] = useState<any[]>([]);
    const [subject, setSubject] = useState("");
    const [body, setBody] = useState("");
    const [sending, setSending] = useState(false);
    const [result, setResult] = useState("");

    useEffect(() => {
        fetch("/api/newsletter").then((r) => r.json()).then((d) => setSubscribers(Array.isArray(d) ? d : []));
    }, []);

    async function send(e: React.FormEvent) {
        e.preventDefault();
        if (!subject || !body) return;
        setSending(true); setResult("");
        const res = await fetch("/api/newsletter/send", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ subject, body }),
        });
        const data = await res.json();
        if (res.ok) setResult(`✓ Sent to ${data.sent} subscriber(s)`);
        else setResult(`✗ Error: ${data.error}`);
        setSending(false);
    }

    return (
        <>
            <div className="admin-header">
                <h1>Newsletter</h1>
                <span style={{ fontSize: "0.875rem", color: "var(--grey-600)" }}>
                    {subscribers.length} active subscriber{subscribers.length !== 1 ? "s" : ""}
                </span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, alignItems: "start" }}>
                {/* Compose */}
                <div className="admin-card">
                    <h2 style={{ fontFamily: "var(--font-serif)", fontWeight: 400, fontSize: "1.3rem", marginBottom: 24 }}>
                        Compose Email
                    </h2>
                    <form onSubmit={send} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                        <div className="form-group">
                            <label className="form-label">Subject *</label>
                            <input className="form-input" required value={subject} onChange={(e) => setSubject(e.target.value)}
                                placeholder="Vernisaj: [Exhibition Title] — 15 March 2026" />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Message *</label>
                            <textarea className="form-textarea" rows={10} required value={body} onChange={(e) => setBody(e.target.value)}
                                placeholder="Dear friends of NOD FLOW,&#10;&#10;We are delighted to invite you to the opening of..." />
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                            <button type="submit" className="btn btn--dark" disabled={sending} id="newsletter-send-btn">
                                {sending ? "Sending..." : `Send to ${subscribers.length} subscribers`}
                            </button>
                            {result && (
                                <span style={{ fontSize: "0.85rem", color: result.startsWith("✓") ? "#1a6931" : "#c0392b" }}>
                                    {result}
                                </span>
                            )}
                        </div>
                    </form>
                </div>

                {/* Subscribers */}
                <div className="admin-card" style={{ padding: 0 }}>
                    <div style={{ padding: "24px 24px 0" }}>
                        <h2 style={{ fontFamily: "var(--font-serif)", fontWeight: 400, fontSize: "1.3rem", marginBottom: 20 }}>
                            Subscribers
                        </h2>
                    </div>
                    <table className="admin-table">
                        <thead><tr><th>Email</th><th>Name</th><th>Since</th></tr></thead>
                        <tbody>
                            {subscribers.length === 0 && (
                                <tr><td colSpan={3} style={{ textAlign: "center", color: "var(--grey-600)", fontStyle: "italic" }}>No subscribers yet.</td></tr>
                            )}
                            {subscribers.map((s) => (
                                <tr key={s._id}>
                                    <td>{s.email}</td>
                                    <td>{s.name || "—"}</td>
                                    <td style={{ fontSize: "0.8rem", color: "var(--grey-600)" }}>
                                        {new Date(s.createdAt).toLocaleDateString("en-GB")}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}
