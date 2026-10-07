import mongoose from 'mongoose';

const ContactSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Name is required'], trim: true },
    email: { type: String, required: [true, 'Email is required'], trim: true, lowercase: true },
    phone: { type: String, required: [true, 'Phone number is required'], trim: true },
    subject: { type: String, default: 'General Inquiry' },
    message: { type: String, required: [true, 'Message is required'], trim: true },
    status: { type: String, enum: ['New', 'Reviewed', 'Resolved'], default: 'New' },
  },
  { timestamps: true }
);

export default mongoose.models.Contact || mongoose.model('Contact', ContactSchema);
