"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const DEFAULT_NAV = [
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
    const [settings, setSettings] = useState<any>(null);
    const pathname = usePathname();

    useEffect(() => {
        fetch("/api/settings").then(r => r.json()).then(setSettings).catch(() => { });
    }, []);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 60);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => { setMenuOpen(false); }, [pathname]);

    const isDark = dark && !scrolled;
    const galleryName = settings?.galleryName || "NOD FLOW";
    const logoUrl = settings?.logoUrl || "";
    const navLinks = settings?.navLinks?.length ? settings.navLinks : DEFAULT_NAV;

    return (
        <>
            <nav className={`nav ${isDark ? "nav--dark" : ""} ${scrolled ? "nav--scrolled" : ""}`}>
                <div className="nav__inner">
                    <Link href="/" className="nav__logo">
                        {logoUrl
                            ? <img src={logoUrl} alt={galleryName} style={{ height: 32, objectFit: "contain" }} />
                            : galleryName
                        }
                    </Link>
                    <div className="nav__links">
                        {navLinks.map((link: any) => (
                            <div key={link.href} style={{ position: "relative" }} className="nav__link-wrap">
                                <Link
                                    href={link.href}
                                    className={`nav__link ${pathname.startsWith(link.href) ? "nav__link--active" : ""}`}
                                >
                                    {link.label}
                                    {link.children?.length > 0 && <span style={{ fontSize: "0.6em", marginLeft: 4 }}>▾</span>}
                                </Link>
                                {link.children?.length > 0 && (
                                    <div className="nav__dropdown">
                                        {link.children.map((child: any) => (
                                            <Link key={child.href} href={child.href} className="nav__dropdown-item">
                                                {child.label}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                    <button
                        className="nav__menu-btn"
                        onClick={() => setMenuOpen(!menuOpen)}
                        aria-label="Toggle menu"
                        id="nav-menu-btn"
                    >
                        <span style={{ transform: menuOpen ? "rotate(45deg) translateY(6px)" : "none" }} />
                        <span style={{ opacity: menuOpen ? 0 : 1 }} />
                        <span style={{ transform: menuOpen ? "rotate(-45deg) translateY(-6px)" : "none" }} />
                    </button>
                </div>
            </nav>

            {/* Mobile Menu */}
            <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
                {navLinks.map((link: any) => (
                    <div key={link.href}>
                        <Link href={link.href} className="mobile-menu__link">{link.label}</Link>
                        {link.children?.map((child: any) => (
                            <Link key={child.href} href={child.href} className="mobile-menu__link" style={{ paddingLeft: 32, fontSize: "0.85rem", opacity: 0.7 }}>
                                {child.label}
                            </Link>
                        ))}
                    </div>
                ))}
            </div>
        </>
    );
}
