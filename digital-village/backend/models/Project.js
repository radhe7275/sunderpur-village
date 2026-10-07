import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    code: { type: String, default: '' },
    description: { type: String, required: true },
    status: {
      type: String,
      enum: ['Completed', 'In Progress', 'Planning', 'Ongoing'],
      default: 'In Progress',
    },
    progress: { type: Number, min: 0, max: 100, default: 0 },
    budget: { type: String, default: '₹15 Lakhs' },
    completionDate: { type: String, default: '2026' },
    beneficiaries: { type: String, default: 'All Village Residents' },
    image: { type: String, default: '' },
    icon: { type: String, default: 'fa-solid fa-list-check' },
  },
  { timestamps: true }
);

export default mongoose.models.Project || mongoose.model('Project', ProjectSchema);
