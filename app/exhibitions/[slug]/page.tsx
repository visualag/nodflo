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

export default function ExhibitionDetailPage() {
    const params = useParams();
    const [exhibition, setExhibition] = useState<any>(null);
    const [lightbox, setLightbox] = useState<string | null>(null);

    useEffect(() => {
        if (!params.slug) return;
        fetch(`/api/exhibitions?slug=${params.slug}`)
            .then((r) => r.json())
            .then((data) => {
                const found = Array.isArray(data) ? data.find((e: any) => e.slug === params.slug) : null;
                setExhibition(found);
            })
            .catch(() => { });
    }, [params.slug]);

    if (!exhibition) {
        return (
            <>
                <Nav />
                <div style={{ paddingTop: "var(--nav-h)", minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <p className="text-muted">Loading...</p>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Nav dark />

            {/* Exhibition Hero */}
            <div className="exhibition-hero">
                {exhibition.coverImage && (
                    <img src={exhibition.coverImage} alt={exhibition.title} />
                )}
                <div className="exhibition-hero__info">
                    <div style={{ fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 16 }}>
                        {exhibition.type === "current" ? "On View" : exhibition.type === "upcoming" ? "Upcoming" : "Past"}
                    </div>
                    <h1 style={{ fontFamily: "var(--font-serif)", color: "var(--white)", fontWeight: 400, fontSize: "clamp(2rem,5vw,4rem)", marginBottom: 12 }}>
                        {exhibition.title}
                    </h1>
                    <p style={{ color: "rgba(245,244,240,0.75)", fontFamily: "var(--font-serif)", fontSize: "1.1rem", fontStyle: "italic", marginBottom: 20 }}>
                        {exhibition.artist}
                    </p>
                    <p style={{ color: "rgba(245,244,240,0.5)", fontSize: "0.8rem", letterSpacing: "0.08em" }}>
                        {formatDate(exhibition.startDate)} — {formatDate(exhibition.endDate)} &nbsp;·&nbsp; {exhibition.location}
                    </p>
                </div>
            </div>

            <section className="section">
                <div className="container">
                    <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 80 }}>
                        <div>
                            {exhibition.description && (
                                <>
                                    <h2 style={{ fontFamily: "var(--font-serif)", fontWeight: 400, fontSize: "1.5rem", marginBottom: 24 }}>
                                        About the Exhibition
                                    </h2>
                                    <p style={{ lineHeight: 1.9 }}>{exhibition.description}</p>
                                </>
                            )}

                            {exhibition.pressRelease && (
                                <>
                                    <hr className="divider" />
                                    <h3 style={{ fontFamily: "var(--font-serif)", fontWeight: 400, marginBottom: 16 }}>Press Release</h3>
                                    <p style={{ whiteSpace: "pre-wrap", lineHeight: 1.9 }}>{exhibition.pressRelease}</p>
                                </>
                            )}
                        </div>
                        <div>
                            <h3 style={{ fontFamily: "var(--font-serif)", fontWeight: 400, fontSize: "1rem", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 20, opacity: 0.5 }}>
                                Details
                            </h3>
                            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                                <div>
                                    <div style={{ fontSize: "0.65rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--grey-600)", marginBottom: 6 }}>Artist</div>
                                    <div style={{ fontFamily: "var(--font-serif)", fontSize: "1.1rem" }}>{exhibition.artist}</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: "0.65rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--grey-600)", marginBottom: 6 }}>Dates</div>
                                    <div>{formatDate(exhibition.startDate)} — {formatDate(exhibition.endDate)}</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: "0.65rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--grey-600)", marginBottom: 6 }}>Location</div>
                                    <div>{exhibition.location}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Image Gallery */}
                    {exhibition.images?.length > 0 && (
                        <>
                            <hr className="divider" />
                            <h3 style={{ fontFamily: "var(--font-serif)", fontWeight: 400, marginBottom: 32 }}>Installation Views</h3>
                            <div className="gallery-grid">
                                {exhibition.images.map((img: string, i: number) => (
                                    <img
                                        key={i} src={img} alt={`View ${i + 1}`}
                                        className="gallery-img"
                                        onClick={() => setLightbox(img)}
                                    />
                                ))}
                            </div>
                        </>
                    )}

                    <hr className="divider" />
                    <Link href="/exhibitions" className="btn btn--outline">← All Exhibitions</Link>
                </div>
            </section>

            {lightbox && (
                <div className="lightbox" onClick={() => setLightbox(null)}>
                    <button className="lightbox__close" onClick={() => setLightbox(null)}>✕</button>
                    <img src={lightbox} alt="Full view" onClick={(e) => e.stopPropagation()} />
                </div>
            )}

            <Footer />
        </>
    );
}
