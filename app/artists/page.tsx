"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

const FALLBACK = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&q=80";

export default function ArtistsPage() {
    const [artists, setArtists] = useState<any[]>([]);

    useEffect(() => {
        fetch("/api/artists").then((r) => r.json()).then(setArtists).catch(() => { });
    }, []);

    return (
        <>
            <Nav />
            <div style={{ paddingTop: "var(--nav-h)" }}>
                <section className="section">
                    <div className="container">
                        <h1 style={{ fontFamily: "var(--font-serif)", fontWeight: 400, marginBottom: 8 }}>Artists</h1>
                        <p className="text-muted" style={{ marginBottom: 64 }}>Artists represented and exhibited by NOD FLOW</p>

                        {artists.length === 0 ? (
                            <p style={{ fontStyle: "italic", color: "var(--grey-600)", padding: "80px 0" }}>
                                Artist roster coming soon.
                            </p>
                        ) : (
                            <div className="artist-grid">
                                {artists.map((a) => (
                                    <Link href={`/artists/${a.slug}`} key={a._id} className="artist-card">
                                        <div className="artist-card__img-wrap">
                                            <img src={a.photo || FALLBACK} alt={a.name} className="artist-card__img" />
                                        </div>
                                        <div className="artist-card__name">{a.name}</div>
                                        {a.nationality && <div className="artist-card__nationality">{a.nationality}</div>}
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </section>
            </div>
            <Footer />
        </>
    );
}
