"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

const footerLinks = {
    exhibitions: [
        { href: "/exhibitions?type=current", label: "Current" },
        { href: "/exhibitions?type=upcoming", label: "Upcoming" },
        { href: "/exhibitions?type=past", label: "Archive" },
    ],
    gallery: [
        { href: "/artists", label: "Artists" },
        { href: "/team", label: "Team" },
        { href: "/sponsors", label: "Sponsors" },
        { href: "/news", label: "News & Press" },
    ],
    participate: [
        { href: "/open-calls", label: "Open Calls" },
        { href: "/contact", label: "Contact" },
        { href: "/contact#visit", label: "Visit Us" },
    ],
};

export default function Footer() {
    const [settings, setSettings] = useState<any>(null);

    useEffect(() => {
        fetch("/api/settings").then(r => r.json()).then(setSettings).catch(() => { });
    }, []);

    const name = settings?.galleryName || "NOD FLOW";
    const desc = settings?.footerDescription || "A contemporary art gallery dedicated to presenting groundbreaking exhibitions.";
    const addr = settings?.address || "Bucharest, Romania";
    const copyright = settings?.footerText || `© ${new Date().getFullYear()} ${name}. All rights reserved.`;

    return (
        <footer className="footer">
            <div className="container">
                <div className="footer__grid">
                    <div>
                        <div className="footer__logo">{name}</div>
                        <p className="footer__desc">{desc}</p>
                        <p style={{ fontSize: "0.8rem", color: "rgba(245,244,240,0.4)" }}>
                            {addr}
                        </p>
                    </div>

                    <div>
                        <div className="footer__col-title">Exhibitions</div>
                        <div className="footer__links">
                            {footerLinks.exhibitions.map((l) => (
                                <Link key={l.href} href={l.href} className="footer__link">
                                    {l.label}
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div>
                        <div className="footer__col-title">Gallery</div>
                        <div className="footer__links">
                            {footerLinks.gallery.map((l) => (
                                <Link key={l.href} href={l.href} className="footer__link">
                                    {l.label}
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div>
                        <div className="footer__col-title">Participate</div>
                        <div className="footer__links">
                            {footerLinks.participate.map((l) => (
                                <Link key={l.href} href={l.href} className="footer__link">
                                    {l.label}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="footer__bottom">
                    <span>{copyright}</span>
                    <span>
                        <Link href="/admin" style={{ color: "rgba(245,244,240,0.2)" }}>
                            Admin
                        </Link>
                    </span>
                </div>
            </div>
        </footer>
    );
}
