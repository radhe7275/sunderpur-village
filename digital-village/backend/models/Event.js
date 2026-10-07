import mongoose from 'mongoose';

const EventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    date: { type: String, required: true }, // e.g. "2026-11-15T09:00:00"
    displayDate: { type: String, default: 'Nov 15, 2026' },
    location: { type: String, required: true },
    description: { type: String, required: true },
    organizer: { type: String, default: 'Gram Panchayat & Village Youth Council' },
    category: { type: String, default: 'Community' },
    icon: { type: String, default: 'fa-solid fa-calendar-check' },
  },
  { timestamps: true }
);

export default mongoose.models.Event || mongoose.model('Event', EventSchema);
