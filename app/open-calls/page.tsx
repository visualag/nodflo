"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

function formatDate(d: string) {
    if (!d) return "";
    return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

export default function OpenCallsPage() {
    const [calls, setCalls] = useState<any[]>([]);

    useEffect(() => {
        fetch("/api/open-calls").then((r) => r.json()).then(setCalls).catch(() => { });
    }, []);

    const active = calls.filter((c) => c.isActive);
    const closed = calls.filter((c) => !c.isActive);

    return (
        <>
            <Nav />
            <div style={{ paddingTop: "var(--nav-h)" }}>
                <section className="section">
                    <div className="container">
                        <h1 style={{ fontFamily: "var(--font-serif)", fontWeight: 400, marginBottom: 16 }}>Open Calls</h1>
                        <p style={{ color: "var(--grey-400)", maxWidth: 600, marginBottom: 64, lineHeight: 1.75 }}>
                            NOD FLOW regularly invites artists to apply for upcoming exhibitions and residency programmes.
                            Below are our current open calls.
                        </p>

                        {active.length === 0 ? (
                            <div style={{ padding: "80px 0", borderTop: "1px solid rgba(0,0,0,0.08)" }}>
                                <p style={{ fontStyle: "italic", color: "var(--grey-600)" }}>
                                    No open calls at the moment. Subscribe to our newsletter to be notified when new calls open.
                                </p>
                            </div>
                        ) : (
                            <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
                                {active.map((call) => (
                                    <Link
                                        href={`/open-calls/${call.slug}`}
                                        key={call._id}
                                        style={{
                                            display: "grid", gridTemplateColumns: "1fr auto",
                                            alignItems: "center", gap: 32,
                                            padding: "32px 0", borderTop: "1px solid rgba(0,0,0,0.1)",
                                            textDecoration: "none",
                                        }}
                                    >
                                        <div>
                                            <div style={{ fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--accent-dark)", marginBottom: 10 }}>
                                                Open Call
                                            </div>
                                            <h2 style={{ fontFamily: "var(--font-serif)", fontWeight: 400, fontSize: "clamp(1.3rem,2.5vw,2rem)", marginBottom: 12 }}>
                                                {call.title}
                                            </h2>
                                            {call.deadline && (
                                                <p style={{ fontSize: "0.8rem", color: "var(--grey-600)" }}>
                                                    Deadline: {formatDate(call.deadline)}
                                                </p>
                                            )}
                                        </div>
                                        <div className="btn btn--outline">Apply →</div>
                                    </Link>
                                ))}
                            </div>
                        )}

                        {closed.length > 0 && (
                            <>
                                <hr className="divider" />
                                <h2 style={{ fontFamily: "var(--font-serif)", fontWeight: 400, fontSize: "1.2rem", color: "var(--grey-400)", marginBottom: 32 }}>
                                    Past Open Calls
                                </h2>
                                <div style={{ display: "flex", flexDirection: "column" }}>
                                    {closed.map((call) => (
                                        <div key={call._id} style={{ padding: "20px 0", borderTop: "1px solid rgba(0,0,0,0.06)", opacity: 0.55 }}>
                                            <h3 style={{ fontFamily: "var(--font-serif)", fontWeight: 400 }}>{call.title}</h3>
                                            {call.deadline && (
                                                <p style={{ fontSize: "0.75rem", color: "var(--grey-600)", marginTop: 4 }}>
                                                    Closed {formatDate(call.deadline)}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </section>
            </div>
            <Footer />
        </>
    );
}
