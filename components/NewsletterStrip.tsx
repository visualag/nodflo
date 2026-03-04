"use client";
import { useState } from "react";

export function NewsletterStrip() {
    const [email, setEmail] = useState("");
    const [subscribed, setSubscribed] = useState(false);

    async function handleSubscribe(e: React.FormEvent) {
        e.preventDefault();
        if (!email) return;
        try {
            const res = await fetch("/api/newsletter", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, role: "lover" }), // Default role
            });
            if (res.ok) setSubscribed(true);
        } catch (err) { }
    }

    return (
        <section className="newsletter-strip">
            <div className="container">
                <div className="newsletter-strip__inner">
                    <div className="newsletter-strip__text">
                        <h2>Stay informed</h2>
                        <p>Receive invitations to openings, news, and calls for artists.</p>
                    </div>
                    {subscribed ? (
                        <p style={{ color: "var(--accent)", fontSize: "0.9rem", fontStyle: "italic" }}>
                            Thank you for subscribing.
                        </p>
                    ) : (
                        <form className="newsletter-form" onSubmit={handleSubscribe}>
                            <input
                                type="email"
                                placeholder="Your email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                id="newsletter-email"
                            />
                            <button type="submit">Subscribe</button>
                        </form>
                    )}
                </div>
            </div>
        </section>
    );
}
