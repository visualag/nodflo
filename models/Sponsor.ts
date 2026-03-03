import mongoose, { Schema, models } from 'mongoose';

const SponsorSchema = new Schema({
    name: { type: String, required: true },
    logo: { type: String },
    website: { type: String },
    tier: { type: String, enum: ['gold', 'silver', 'partner'], default: 'partner' },
    order: { type: Number, default: 0 },
}, { timestamps: true });

export default models.Sponsor || mongoose.model('Sponsor', SponsorSchema);
