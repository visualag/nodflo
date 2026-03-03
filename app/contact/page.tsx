"use client";
import { useState } from "react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export default function ContactPage() {
    const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        await fetch("/api/contact", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        });
        setSubmitted(true);
        setLoading(false);
    }

    return (
        <>
            <Nav />
            <div style={{ paddingTop: "var(--nav-h)" }}>
                <section className="section">
                    <div className="container">
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 96, alignItems: "start" }}>
                            {/* Info */}
                            <div>
                                <h1 style={{ fontFamily: "var(--font-serif)", fontWeight: 400, marginBottom: 48 }}>Contact</h1>

                                <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
                                    <div>
                                        <div style={{ fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--grey-600)", marginBottom: 12 }}>Address</div>
                                        <p style={{ lineHeight: 1.8 }}>NOD FLOW Gallery<br />Bucharest, Romania</p>
                                    </div>

                                    <div>
                                        <div style={{ fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--grey-600)", marginBottom: 12 }}>Opening Hours</div>
                                        <p style={{ lineHeight: 1.8 }}>
                                            Tuesday — Saturday<br />
                                            11:00 — 18:00<br />
                                            <span style={{ color: "var(--grey-600)", fontSize: "0.85rem" }}>Free admission</span>
                                        </p>
                                    </div>

                                    <div>
                                        <div style={{ fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--grey-600)", marginBottom: 12 }}>Email</div>
                                        <a href="mailto:info@nodflo.com" style={{ fontSize: "0.9rem" }}>info@nodflo.com</a>
                                    </div>

                                    <div id="visit">
                                        <div style={{ fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--grey-600)", marginBottom: 12 }}>Press</div>
                                        <a href="mailto:press@nodflo.com" style={{ fontSize: "0.9rem" }}>press@nodflo.com</a>
                                    </div>
                                </div>
                            </div>

                            {/* Form */}
                            <div>
                                <h2 style={{ fontFamily: "var(--font-serif)", fontWeight: 400, fontSize: "1.5rem", marginBottom: 32 }}>Send a message</h2>
                                {submitted ? (
                                    <div style={{ padding: "48px", background: "var(--cream)" }}>
                                        <h3 style={{ fontFamily: "var(--font-serif)", fontWeight: 400, marginBottom: 12 }}>Message Received</h3>
                                        <p style={{ color: "var(--grey-400)" }}>We'll get back to you as soon as possible.</p>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                                        <div className="form-grid">
                                            <div className="form-group">
                                                <label className="form-label">Name *</label>
                                                <input className="form-input" required value={form.name}
                                                    onChange={(e) => setForm({ ...form, name: e.target.value })} />
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label">Email *</label>
                                                <input className="form-input" type="email" required value={form.email}
                                                    onChange={(e) => setForm({ ...form, email: e.target.value })} />
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Subject</label>
                                            <input className="form-input" value={form.subject}
                                                onChange={(e) => setForm({ ...form, subject: e.target.value })} />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Message *</label>
                                            <textarea className="form-textarea" required rows={6} value={form.message}
                                                onChange={(e) => setForm({ ...form, message: e.target.value })} />
                                        </div>
                                        <div>
                                            <button type="submit" className="btn btn--dark" disabled={loading} id="contact-submit-btn">
                                                {loading ? "Sending..." : "Send Message →"}
                                            </button>
                                        </div>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>
                </section>
            </div>
            <Footer />
        </>
    );
}
