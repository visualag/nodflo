"use client";
import { useState, useEffect } from "react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

function formatDate(d: string) {
    if (!d) return "";
    return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

export default function NewsPage() {
    const [news, setNews] = useState<any[]>([]);

    useEffect(() => {
        fetch("/api/news").then((r) => r.json()).then(setNews).catch(() => { });
    }, []);

    return (
        <>
            <Nav />
            <div style={{ paddingTop: "var(--nav-h)" }}>
                <section className="section">
                    <div className="container">
                        <h1 style={{ fontFamily: "var(--font-serif)", fontWeight: 400, marginBottom: 64 }}>News & Press</h1>

                        {news.length === 0 ? (
                            <p style={{ fontStyle: "italic", color: "var(--grey-600)", padding: "80px 0" }}>
                                News coming soon.
                            </p>
                        ) : (
                            <div className="news-grid">
                                {news.map((item) => (
                                    <a
                                        key={item._id}
                                        href={item.link || "#"}
                                        target={item.link ? "_blank" : "_self"}
                                        rel="noopener noreferrer"
                                        className="news-card"
                                        style={{ textDecoration: "none" }}
                                    >
                                        {item.image && (
                                            <div className="news-card__img-wrap">
                                                <img src={item.image} alt={item.title} className="news-card__img" />
                                            </div>
                                        )}
                                        <div className="news-card__source">{item.source}</div>
                                        <div className="news-card__title">{item.title}</div>
                                        {item.excerpt && (
                                            <p style={{ fontSize: "0.85rem", color: "var(--grey-400)", marginTop: 8, lineHeight: 1.7 }}>
                                                {item.excerpt}
                                            </p>
                                        )}
                                        <div className="news-card__date" style={{ marginTop: 12 }}>{formatDate(item.date)}</div>
                                    </a>
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
