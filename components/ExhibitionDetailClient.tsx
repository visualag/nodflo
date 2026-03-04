"use client";
import { useState } from "react";

export function ExhibitionDetailClient({ images }: { images: string[] }) {
    const [lightbox, setLightbox] = useState<string | null>(null);

    if (!images || images.length === 0) return null;

    return (
        <>
            <hr className="divider" />
            <h3 style={{ fontFamily: "var(--font-serif)", fontWeight: 400, marginBottom: 32 }}>Installation Views</h3>
            <div className="gallery-grid">
                {images.map((img, i) => (
                    <img
                        key={i} src={img} alt={`View ${i + 1}`}
                        className="gallery-img"
                        onClick={() => setLightbox(img)}
                        style={{ cursor: "pointer" }}
                    />
                ))}
            </div>

            {lightbox && (
                <div className="lightbox" onClick={() => setLightbox(null)}>
                    <button className="lightbox__close" onClick={() => setLightbox(null)}>✕</button>
                    <img src={lightbox} alt="Full view" onClick={(e) => e.stopPropagation()} />
                </div>
            )}
        </>
    );
}
