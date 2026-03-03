"use client";
import { useState, useEffect } from "react";

export default function AdminArtistDatabase() {
    const [artists, setArtists] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    async function load() {
        setLoading(true);
        try {
            const res = await fetch("/api/artists/database");
            const data = await res.json();
            setArtists(Array.isArray(data) ? data : []);
        } catch (e) {
            console.error(e);
        }
        setLoading(false);
    }

    useEffect(() => { load(); }, []);

    async function remove(id: string) {
        if (!confirm("Remove this artist from the database?")) return;
        await fetch(`/api/artists/database?id=${id}`, { method: "DELETE" });
        load();
    }

    function exportCSV() {
        const headers = ["Name", "Email", "Phone", "Website", "Consent", "Last Applied"];
        const rows = artists.map(a => [
            a.name, a.email, a.phone || "", a.website || "",
            a.consentToContact ? "Yes" : "No",
            new Date(a.lastAppliedDate).toLocaleDateString()
        ]);

        const content = [headers, ...rows].map(e => e.join(",")).join("\n");
        const blob = new Blob([content], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `nodflo-artist-database-${new Date().toISOString().slice(0, 10)}.csv`;
        a.click();
    }

    return (
        <div className="admin-container">
            <div className="admin-header">
                <h1 className="admin-title">Artist Database</h1>
                <div style={{ display: "flex", gap: 12 }}>
                    <button className="btn btn--outline" onClick={exportCSV}>Export CSV</button>
                    <button className="btn btn--dark" onClick={load}>Refresh</button>
                </div>
            </div>

            <p style={{ color: "var(--grey-400)", marginBottom: 32, fontSize: "0.9rem" }}>
                This is a permanent database of artists who have applied to open calls and opted-in to be contacted for future opportunities.
            </p>

            <div className="card" style={{ padding: 0 }}>
                {loading ? (
                    <div style={{ padding: 48, textAlign: "center", color: "var(--grey-600)" }}>Loading artists...</div>
                ) : (
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Website</th>
                                <th>Consent</th>
                                <th>Last Activity</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {artists.length === 0 && (
                                <tr><td colSpan={7} style={{ textAlign: "center", padding: 48, color: "var(--grey-400)" }}>No artists in database yet.</td></tr>
                            )}
                            {artists.map((a) => (
                                <tr key={a._id}>
                                    <td style={{ fontWeight: 500 }}>{a.name}</td>
                                    <td><a href={`mailto:${a.email}`} style={{ color: "var(--grey-600)" }}>{a.email}</a></td>
                                    <td style={{ fontSize: "0.85rem" }}>{a.phone || "—"}</td>
                                    <td>{a.website ? <a href={a.website} target="_blank" style={{ color: "var(--accent-dark)", fontSize: "0.8rem" }}>Visit</a> : "—"}</td>
                                    <td>
                                        <span className={`tag ${a.consentToContact ? "tag--active" : "tag--inactive"}`}>
                                            {a.consentToContact ? "Subscribed" : "Limited"}
                                        </span>
                                    </td>
                                    <td style={{ fontSize: "0.8rem", color: "var(--grey-400)" }}>
                                        {new Date(a.lastAppliedDate).toLocaleDateString("en-GB")}
                                    </td>
                                    <td style={{ textAlign: "right" }}>
                                        <button onClick={() => remove(a._id)} style={{ color: "#ef4444", background: "none", border: "none", cursor: "pointer", fontSize: "0.75rem" }}>
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
