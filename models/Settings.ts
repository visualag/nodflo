import mongoose from 'mongoose';

const HeroSlideSchema = new mongoose.Schema({
    img: { type: String, required: true },
    eyebrow: { type: String },
    title: { type: String },
    subtitle: { type: String },
    link: { type: String },
});

const SettingsSchema = new mongoose.Schema({
    heroSlides: [HeroSlideSchema],
    galleryName: { type: String, default: 'NOD FLOW' },
    aboutText: { type: String },
    contactEmail: { type: String, default: 'info@nodflo.com' },
    contactPhone: { type: String },
    pressEmail: { type: String, default: 'press@nodflo.com' },
    address: { type: String, default: 'Bucharest, Romania' },
    hours: { type: String, default: 'Tuesday — Saturday, 11:00 — 18:00' },
    mapUrl: { type: String },
    footerDescription: { type: String, default: 'A contemporary art gallery dedicated to presenting groundbreaking exhibitions.' },
    footerText: { type: String, default: '© 2026 NOD FLOW. All rights reserved.' },
    homepageExtraTitle: { type: String },
    homepageExtraContent: { type: String },
    homepageExtraImage: { type: String },
}, { timestamps: true });

export default mongoose.models.Settings || mongoose.model('Settings', SettingsSchema);
