import mongoose from 'mongoose';

const GallerySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    category: {
      type: String,
      enum: ['Nature', 'People', 'Festivals', 'Development'],
      required: true,
    },
    imageUrl: { type: String, required: true },
    caption: { type: String, default: '' },
    tags: [{ type: String }],
  },
  { timestamps: true }
);

export default mongoose.models.Gallery || mongoose.model('Gallery', GallerySchema);
