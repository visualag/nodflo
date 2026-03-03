import mongoose, { Schema, models } from 'mongoose';

const NewsletterSubscriberSchema = new Schema({
    email: { type: String, required: true, unique: true },
    name: { type: String },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

export default models.NewsletterSubscriber || mongoose.model('NewsletterSubscriber', NewsletterSubscriberSchema);
