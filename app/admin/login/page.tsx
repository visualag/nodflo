"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true); setError("");
        const result = await signIn("credentials", {
            email, password, redirect: false,
        });
        if (result?.error) {
            setError("Invalid credentials. Please try again.");
            setLoading(false);
        } else {
            router.push("/admin");
        }
    }

    return (
        <div style={{
            minHeight: "100vh", background: "var(--black)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "var(--font-sans)",
        }}>
            <div style={{ width: "100%", maxWidth: 400, padding: "0 24px" }}>
                <div style={{ textAlign: "center", marginBottom: 48 }}>
                    <div style={{
                        fontFamily: "var(--font-serif)", fontSize: "1.5rem",
                        letterSpacing: "0.2em", textTransform: "uppercase",
                        color: "var(--white)", marginBottom: 8,
                    }}>
                        NOD FLOW
                    </div>
                    <p style={{ color: "rgba(245,244,240,0.4)", fontSize: "0.75rem", letterSpacing: "0.1em" }}>
                        Admin Panel
                    </p>
                </div>

                <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                    <div className="form-group">
                        <label className="form-label" style={{ color: "rgba(245,244,240,0.5)" }}>Email</label>
                        <input
                            type="email" required className="form-input" id="admin-email"
                            style={{ background: "rgba(255,255,255,0.05)", color: "var(--white)", borderColor: "rgba(255,255,255,0.15)" }}
                            value={email} onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label" style={{ color: "rgba(245,244,240,0.5)" }}>Password</label>
                        <input
                            type="password" required className="form-input" id="admin-password"
                            style={{ background: "rgba(255,255,255,0.05)", color: "var(--white)", borderColor: "rgba(255,255,255,0.15)" }}
                            value={password} onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    {error && (
                        <p style={{ color: "#e74c3c", fontSize: "0.8rem", textAlign: "center" }}>{error}</p>
                    )}
                    <button
                        type="submit" disabled={loading} id="admin-login-btn"
                        style={{
                            background: "var(--accent)", color: "var(--black)",
                            border: "none", padding: "14px", cursor: "pointer",
                            fontSize: "0.75rem", letterSpacing: "0.2em", textTransform: "uppercase",
                            marginTop: 8, transition: "background 0.3s",
                        }}
                    >
                        {loading ? "Signing in..." : "Sign In"}
                    </button>
                </form>
            </div>
        </div>
    );
}
