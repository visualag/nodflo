import mongoose, { Schema, models } from 'mongoose';

const NewsSchema = new Schema({
    title: { type: String, required: true },
    date: { type: Date, required: true },
    excerpt: { type: String },
    content: { type: String },
    link: { type: String },
    image: { type: String },
    source: { type: String },
    featured: { type: Boolean, default: false },
}, { timestamps: true });

export default models.News || mongoose.model('News', NewsSchema);
