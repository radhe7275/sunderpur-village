import mongoose from 'mongoose';

const FacilitySchema = new mongoose.Schema(
  {
    order: { type: Number, required: true },
    title: { type: String, required: true },
    icon: { type: String, required: true }, // Font Awesome class, e.g. "fa-solid fa-graduation-cap"
    category: { type: String, default: 'Essential' },
    description: { type: String, required: true },
    details: { type: String, default: '' },
    isAvailable: { type: Boolean, default: true },
    timings: { type: String, default: 'Open 24/7' },
    contactPerson: { type: String, default: 'Panchayat Helpdesk' },
  },
  { timestamps: true }
);

export default mongoose.models.Facility || mongoose.model('Facility', FacilitySchema);
