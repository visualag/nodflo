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
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer__grid">
                    <div>
                        <div className="footer__logo">NOD FLOW</div>
                        <p className="footer__desc">
                            A contemporary art gallery dedicated to presenting groundbreaking exhibitions
                            and supporting the artistic dialogue between emerging and established voices.
                        </p>
                        <p style={{ fontSize: "0.8rem", color: "rgba(245,244,240,0.4)" }}>
                            Bucharest, Romania
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
                    <span>© {new Date().getFullYear()} NOD FLOW. All rights reserved.</span>
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
