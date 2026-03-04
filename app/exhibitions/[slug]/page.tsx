"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import NewsletterForm from "@/components/NewsletterForm";

function formatDate(d: string) {
    if (!d) return "";
    return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

function getGoogleCalendarUrl(ex: any) {
    if (!ex) return "";
    const start = ex.startDate ? new Date(ex.startDate).toISOString().replace(/-|:|\.\d\d\d/g, "") : "";
    const end = ex.endDate ? new Date(ex.endDate).toISOString().replace(/-|:|\.\d\d\d/g, "") : "";
    const details = ex.description || "";
    const locName = ex.location?.name || (typeof ex.location === 'string' ? ex.location : "NOD FLOW Gallery");
    const locAddr = ex.location?.address ? `, ${ex.location.address}` : "";
    return `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(ex.title)}&dates=${start}/${end}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(locName + locAddr)}`;
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
                setExhibition(data);
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

    const locName = exhibition.location?.name || (typeof exhibition.location === 'string' ? exhibition.location : "NOD FLOW Gallery");
    const locAddress = exhibition.location?.address || "";
    const locMapUrl = exhibition.location?.mapUrl || "";

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
                    <div style={{ color: "rgba(245,244,240,0.75)", fontFamily: "var(--font-serif)", fontSize: "1.1rem", fontStyle: "italic", marginBottom: 20 }}>
                        {exhibition.exhibitionType === "Group" ? (
                            "Group Exhibition"
                        ) : (
                            exhibition.artists?.[0]?.artist?.name || exhibition.artists?.[0]?.manualName || exhibition.artist || "Individual Exhibition"
                        )}
                    </div>
                    <p style={{ color: "rgba(245,244,240,0.5)", fontSize: "0.8rem", letterSpacing: "0.08em" }}>
                        {formatDate(exhibition.startDate)} — {formatDate(exhibition.endDate)} &nbsp;·&nbsp; {locName}
                    </p>
                </div>
            </div>

            <section className="section">
                <div className="container">
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 80 }} className="exhibition-detail-grid">
                        <div>
                            {exhibition.description && (
                                <>
                                    <h2 style={{ fontFamily: "var(--font-serif)", fontWeight: 400, fontSize: "1.5rem", marginBottom: 24 }}>
                                        About the Exhibition
                                    </h2>
                                    <p style={{ lineHeight: 1.9, fontSize: "1.05rem", color: "var(--grey-800)" }}>{exhibition.description}</p>
                                </>
                            )}

                            {exhibition.pressRelease && (
                                <>
                                    <hr className="divider" />
                                    <h3 style={{ fontFamily: "var(--font-serif)", fontWeight: 400, marginBottom: 16 }}>Press Release</h3>
                                    <div style={{ whiteSpace: "pre-wrap", lineHeight: 1.9, color: "var(--grey-700)" }}>{exhibition.pressRelease}</div>
                                </>
                            )}

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
                        </div>

                        {/* Sidebar */}
                        <aside>
                            <div style={{ position: "sticky", top: "calc(var(--nav-h) + 40px)", display: "flex", flexDirection: "column", gap: 40 }}>
                                <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                                    <div>
                                        <div style={{ fontSize: "0.65rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--grey-600)", marginBottom: 8 }}>Artists</div>
                                        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                                            {exhibition.artists?.length > 0 ? (
                                                exhibition.artists.map((a: any, i: number) => (
                                                    <div key={i}>
                                                        {a.artist ? (
                                                            <Link href={`/artists/${a.artist.slug}`} style={{ color: "var(--black)", textDecoration: "none", borderBottom: "1px solid transparent", transition: "border 0.2s" }} onMouseEnter={e => e.currentTarget.style.borderBottomColor = "var(--black)"} onMouseLeave={e => e.currentTarget.style.borderBottomColor = "transparent"}>
                                                                {a.artist.name}
                                                            </Link>
                                                        ) : (
                                                            <span>{a.manualName}</span>
                                                        )}
                                                    </div>
                                                ))
                                            ) : (
                                                <div style={{ fontFamily: "var(--font-serif)", fontSize: "1.1rem" }}>{exhibition.artist}</div>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <div style={{ fontSize: "0.65rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--grey-600)", marginBottom: 8 }}>Dates</div>
                                        <div style={{ marginBottom: 12 }}>
                                            {formatDate(exhibition.startDate)} — {formatDate(exhibition.endDate)}
                                        </div>
                                        <a
                                            href={getGoogleCalendarUrl(exhibition)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="btn btn--outline"
                                            style={{ fontSize: "0.7rem", padding: "8px 16px", display: "inline-flex", alignItems: "center", gap: 8 }}
                                        >
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                                            Add to Calendar
                                        </a>
                                    </div>

                                    <div>
                                        <div style={{ fontSize: "0.65rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--grey-600)", marginBottom: 8 }}>Location</div>
                                        <div style={{ fontWeight: 500, marginBottom: 4 }}>{locName}</div>
                                        {locAddress && <div style={{ fontSize: "0.9rem", color: "var(--grey-600)", marginBottom: 12 }}>{locAddress}</div>}
                                        {locMapUrl && (
                                            <a href={locMapUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: "0.75rem", color: "var(--accent)", fontWeight: 500 }}>
                                                View on Map ↗
                                            </a>
                                        )}
                                    </div>
                                </div>

                                <NewsletterForm />
                            </div>
                        </aside>
                    </div>

                    <div style={{ marginTop: 80, borderTop: "1px solid var(--grey-100)", paddingTop: 40 }}>
                        <Link href="/exhibitions" className="btn btn--outline">← Back to Exhibitions</Link>
                    </div>
                </div>
            </section>

            {lightbox && (
                <div className="lightbox" onClick={() => setLightbox(null)}>
                    <button className="lightbox__close" onClick={() => setLightbox(null)}>✕</button>
                    <img src={lightbox} alt="Full view" onClick={(e) => e.stopPropagation()} />
                </div>
            )}

            <Footer />

            <style jsx>{`
                @media (max-width: 900px) {
                    .exhibition-detail-grid {
                        grid-template-columns: 1fr !important;
                        gap: 40px !important;
                    }
                    aside {
                        order: -1;
                    }
                }
            `}</style>
        </>
    );
}
