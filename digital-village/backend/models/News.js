import mongoose from 'mongoose';

const NewsSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    category: {
      type: String,
      enum: ['Village News', 'Government Schemes', 'Development Updates', 'Announcements'],
      default: 'Village News',
    },
    date: { type: String, required: true },
    summary: { type: String, required: true },
    details: { type: String, default: '' },
    isPinned: { type: Boolean, default: false },
    linkText: { type: String, default: 'Read Details' },
  },
  { timestamps: true }
);

export default mongoose.models.News || mongoose.model('News', NewsSchema);
