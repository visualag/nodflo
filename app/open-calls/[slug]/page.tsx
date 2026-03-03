"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

function formatDate(d: string) {
    if (!d) return "";
    return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

export default function OpenCallDetailPage() {
    const params = useParams();
    const [call, setCall] = useState<any>(null);
    const [form, setForm] = useState({
        artistName: "", email: "", phone: "", website: "", portfolioUrl: "", statement: "",
    });
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        fetch("/api/open-calls")
            .then((r) => r.json())
            .then((data: any[]) => setCall(data.find((c) => c.slug === params.slug) || null))
            .catch(() => { });
    }, [params.slug]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true); setError("");
        try {
            const res = await fetch(`/api/open-calls/${call._id}/apply`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            if (res.ok) setSubmitted(true);
            else setError("Something went wrong. Please try again.");
        } catch {
            setError("Failed to submit. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    if (!call) {
        return (
            <>
                <Nav />
                <div style={{ paddingTop: "var(--nav-h)", minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <p className="text-muted">Loading...</p>
                </div>
            </>
        );
    }

    return (
        <>
            <Nav />
            <div style={{ paddingTop: "var(--nav-h)" }}>
                <section className="section">
                    <div className="container">
                        <div style={{ maxWidth: 760 }}>
                            <div style={{ fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: call.isActive ? "var(--accent-dark)" : "var(--grey-600)", marginBottom: 16 }}>
                                {call.isActive ? "Open Call" : "Closed"}
                            </div>
                            <h1 style={{ fontFamily: "var(--font-serif)", fontWeight: 400, marginBottom: 24 }}>{call.title}</h1>
                            {call.deadline && (
                                <p style={{ fontSize: "0.85rem", color: "var(--grey-600)", marginBottom: 40 }}>
                                    Deadline: <strong>{formatDate(call.deadline)}</strong>
                                </p>
                            )}
                            {call.description && (
                                <div style={{ lineHeight: 1.85, marginBottom: 40 }}>
                                    <p>{call.description}</p>
                                </div>
                            )}
                            {call.requirements && (
                                <>
                                    <h3 style={{ fontFamily: "var(--font-serif)", fontWeight: 400, marginBottom: 16 }}>Requirements</h3>
                                    <p style={{ lineHeight: 1.85, color: "var(--grey-400)", marginBottom: 40, whiteSpace: "pre-wrap" }}>{call.requirements}</p>
                                </>
                            )}

                            {call.isActive && (
                                <>
                                    <hr className="divider" />
                                    <h2 style={{ fontFamily: "var(--font-serif)", fontWeight: 400, marginBottom: 32 }}>Apply</h2>
                                    {submitted ? (
                                        <div style={{ padding: "48px", background: "var(--cream)", textAlign: "center" }}>
                                            <h3 style={{ fontFamily: "var(--font-serif)", fontWeight: 400, marginBottom: 12 }}>Application Received</h3>
                                            <p style={{ color: "var(--grey-400)" }}>Thank you for applying. We will be in touch shortly.</p>
                                        </div>
                                    ) : (
                                        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                                            <div className="form-grid">
                                                <div className="form-group">
                                                    <label className="form-label">Full Name *</label>
                                                    <input className="form-input" required value={form.artistName}
                                                        onChange={(e) => setForm({ ...form, artistName: e.target.value })} />
                                                </div>
                                                <div className="form-group">
                                                    <label className="form-label">Email *</label>
                                                    <input className="form-input" type="email" required value={form.email}
                                                        onChange={(e) => setForm({ ...form, email: e.target.value })} />
                                                </div>
                                            </div>
                                            <div className="form-grid">
                                                <div className="form-group">
                                                    <label className="form-label">Phone</label>
                                                    <input className="form-input" value={form.phone}
                                                        onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                                                </div>
                                                <div className="form-group">
                                                    <label className="form-label">Website</label>
                                                    <input className="form-input" type="url" value={form.website}
                                                        onChange={(e) => setForm({ ...form, website: e.target.value })} />
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label">Portfolio URL</label>
                                                <input className="form-input" type="url" value={form.portfolioUrl}
                                                    onChange={(e) => setForm({ ...form, portfolioUrl: e.target.value })} />
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label">Artist Statement *</label>
                                                <textarea className="form-textarea" required rows={6} value={form.statement}
                                                    onChange={(e) => setForm({ ...form, statement: e.target.value })} />
                                            </div>
                                            {error && <p style={{ color: "#c0392b", fontSize: "0.85rem" }}>{error}</p>}
                                            <div>
                                                <button type="submit" className="btn btn--dark" disabled={loading} id="apply-submit-btn">
                                                    {loading ? "Submitting..." : "Submit Application →"}
                                                </button>
                                            </div>
                                        </form>
                                    )}
                                </>
                            )}

                            <hr className="divider" />
                            <Link href="/open-calls" className="btn btn--outline">← All Open Calls</Link>
                        </div>
                    </div>
                </section>
            </div>
            <Footer />
        </>
    );
}
