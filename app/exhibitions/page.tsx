"use client";
import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

interface Exhibition {
    _id: string; title: string; artist: string; type: string;
    startDate: string; endDate: string; coverImage: string; slug: string;
}

function formatDate(d: string) {
    if (!d) return "";
    return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

const FALLBACK = "https://images.unsplash.com/photo-1561731216-c3a4d99437d5?w=900&q=80";
const TYPES = ["all", "current", "upcoming", "past"];

function ExhibitionsContent() {
    const searchParams = useSearchParams();
    const initialType = searchParams.get("type") || "all";
    const [filter, setFilter] = useState(initialType);
    const [exhibitions, setExhibitions] = useState<Exhibition[]>([]);

    useEffect(() => {
        fetch("/api/exhibitions").then((r) => r.json()).then(setExhibitions).catch(() => { });
    }, []);

    const filtered = filter === "all" ? exhibitions : exhibitions.filter((e) => e.type === filter);

    return (
        <>
            {/* Filters */}
            <div style={{ display: "flex", gap: 8, marginBottom: 56 }}>
                {TYPES.map((t) => (
                    <button
                        key={t}
                        onClick={() => setFilter(t)}
                        style={{
                            padding: "8px 20px",
                            border: "1px solid",
                            borderColor: filter === t ? "var(--black)" : "rgba(0,0,0,0.15)",
                            background: filter === t ? "var(--black)" : "transparent",
                            color: filter === t ? "var(--white)" : "var(--black)",
                            fontSize: "0.7rem", letterSpacing: "0.15em", textTransform: "capitalize",
                            cursor: "pointer", transition: "all 0.3s",
                        }}
                    >
                        {t}
                    </button>
                ))}
            </div>

            {filtered.length === 0 ? (
                <p className="text-muted" style={{ fontStyle: "italic", padding: "80px 0" }}>
                    No exhibitions in this category yet.
                </p>
            ) : (
                <div className="exhibition-grid">
                    {filtered.map((ex) => (
                        <Link href={`/exhibitions/${ex.slug}`} key={ex._id} className="exhibition-card">
                            <div className="exhibition-card__img-wrap">
                                <img src={ex.coverImage || FALLBACK} alt={ex.title} className="exhibition-card__img" />
                            </div>
                            <div className="exhibition-card__tag">
                                {ex.type === "current" ? "On View" : ex.type === "upcoming" ? "Upcoming" : "Past"}
                            </div>
                            <div className="exhibition-card__title">{ex.title}</div>
                            <div className="exhibition-card__artist">{ex.artist}</div>
                            <div className="exhibition-card__dates">
                                {formatDate(ex.startDate)} — {formatDate(ex.endDate)}
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </>
    );
}

export default function ExhibitionsPage() {
    return (
        <>
            <Nav />
            <div style={{ paddingTop: "var(--nav-h)" }}>
                <section className="section">
                    <div className="container">
                        <h1 style={{ fontFamily: "var(--font-serif)", fontWeight: 400, marginBottom: 48 }}>
                            Exhibitions
                        </h1>
                        <Suspense fallback={<div style={{ padding: "40px 0", color: "var(--grey-600)" }}>Loading...</div>}>
                            <ExhibitionsContent />
                        </Suspense>
                    </div>
                </section>
            </div>
            <Footer />
        </>
    );
}
