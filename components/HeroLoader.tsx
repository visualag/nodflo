"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export function HeroLoader({ slides }: { slides: any[] }) {
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        if (!slides?.length) return;
        const timer = setInterval(() => {
            setCurrentSlide((p) => (p + 1) % slides.length);
        }, 6000);
        return () => clearInterval(timer);
    }, [slides]);

    const slide = slides[currentSlide];

    if (!slide) return null;

    return (
        <>
            <img
                key={currentSlide}
                src={slide.img}
                alt="Exhibition"
                className="hero__img"
                style={{ animation: "fadeUp 1.2s ease forwards" }}
            />
            <div className="hero__content">
                <div className="hero__eyebrow fade-up">{slide.eyebrow}</div>
                <h1 className="hero__title fade-up fade-up-delay-1">{slide.title}</h1>
                <p className="hero__subtitle fade-up fade-up-delay-2">{slide.subtitle}</p>
                <Link href={slide.link || "/exhibitions"} className="hero__cta fade-up fade-up-delay-3">
                    View More <span>→</span>
                </Link>
            </div>
            <div className="hero__indicators">
                {slides.map((_, i) => (
                    <button
                        key={i}
                        className={`hero__dot ${i === currentSlide ? "active" : ""}`}
                        onClick={() => setCurrentSlide(i)}
                        aria-label={`Slide ${i + 1}`}
                    />
                ))}
            </div>
        </>
    );
}
