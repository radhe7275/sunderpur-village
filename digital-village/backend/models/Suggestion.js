import mongoose from 'mongoose';

const SuggestionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    category: { type: String, default: 'Village Development' },
    message: { type: String, required: true, trim: true },
    upvotes: { type: Number, default: 0 },
    status: { type: String, enum: ['Pending', 'Approved', 'Implemented'], default: 'Pending' },
  },
  { timestamps: true }
);

export default mongoose.models.Suggestion || mongoose.model('Suggestion', SuggestionSchema);
