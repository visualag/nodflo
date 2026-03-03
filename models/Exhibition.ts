import mongoose, { Schema, models } from 'mongoose';

const ExhibitionSchema = new Schema({
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    artist: { type: String, required: true },
    type: { type: String, enum: ['current', 'upcoming', 'past'], default: 'current' },
    startDate: { type: Date },
    endDate: { type: Date },
    location: { type: String, default: 'NOD FLOW Gallery' },
    coverImage: { type: String },
    images: [{ type: String }],
    description: { type: String },
    pressRelease: { type: String },
    featured: { type: Boolean, default: false },
}, { timestamps: true });

export default models.Exhibition || mongoose.model('Exhibition', ExhibitionSchema);
