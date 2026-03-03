"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
    { href: "/exhibitions", label: "Exhibitions" },
    { href: "/artists", label: "Artists" },
    { href: "/open-calls", label: "Open Calls" },
    { href: "/news", label: "News" },
    { href: "/team", label: "Team" },
    { href: "/sponsors", label: "Sponsors" },
    { href: "/contact", label: "Contact" },
];

export default function Nav({ dark = false }: { dark?: boolean }) {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 60);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => {
        setMenuOpen(false);
    }, [pathname]);

    const isDark = dark && !scrolled;

    return (
        <>
            <nav className={`nav ${isDark ? "nav--dark" : ""} ${scrolled ? "nav--scrolled" : ""}`}>
                <div className="nav__inner">
                    <Link href="/" className="nav__logo">
                        NOD FLOW
                    </Link>
                    <div className="nav__links">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`nav__link ${pathname.startsWith(link.href) ? "nav__link--active" : ""}`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>
                    <button
                        className="nav__menu-btn"
                        onClick={() => setMenuOpen(!menuOpen)}
                        aria-label="Toggle menu"
                        id="nav-menu-btn"
                    >
                        <span
                            style={{
                                transform: menuOpen ? "rotate(45deg) translateY(6px)" : "none",
                            }}
                        />
                        <span style={{ opacity: menuOpen ? 0 : 1 }} />
                        <span
                            style={{
                                transform: menuOpen ? "rotate(-45deg) translateY(-6px)" : "none",
                            }}
                        />
                    </button>
                </div>
            </nav>

            {/* Mobile Menu */}
            <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
                {navLinks.map((link) => (
                    <Link key={link.href} href={link.href} className="mobile-menu__link">
                        {link.label}
                    </Link>
                ))}
            </div>
        </>
    );
}
