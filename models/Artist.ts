import mongoose, { Schema, models } from 'mongoose';

const ArtistSchema = new Schema({
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    bio: { type: String },
    nationality: { type: String },
    website: { type: String },
    photo: { type: String },
    images: [{ type: String }],
    featured: { type: Boolean, default: false },
}, { timestamps: true });

export default models.Artist || mongoose.model('Artist', ArtistSchema);
