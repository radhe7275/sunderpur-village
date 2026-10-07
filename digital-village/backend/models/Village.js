import mongoose from 'mongoose';

const VillageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, default: 'Sundarpur' },
    tagline: { type: String, default: 'Our Village, Our Culture, Our Pride 🌾' },
    state: { type: String, default: 'Uttar Pradesh' },
    district: { type: String, default: 'Varanasi' },
    pincode: { type: String, default: '221001' },
    establishedYear: { type: Number, default: 1842 },
    description: {
      type: String,
      default:
        'Sundarpur is an award-winning model Digital Gram Panchayat known for organic agriculture, 100% solar lighting, clean tap water, high-speed fiber connectivity, and deep cultural heritage along the sacred river banks.',
    },
    history: {
      type: String,
      default:
        'Founded in the mid-19th century by agricultural pioneers, Sundarpur flourished as a peaceful trading village. Today, it harmoniously blends ancient traditions, sacred temple festivities, and Vedic heritage with cutting-edge digital infrastructure, solar power, and transparent village governance.',
    },
    statistics: {
      population: { type: Number, default: 5420 },
      houses: { type: Number, default: 1180 },
      schools: { type: Number, default: 4 },
      roadsKm: { type: Number, default: 28 },
      greenAreaPercent: { type: Number, default: 78 },
      waterSources: { type: Number, default: 14 },
    },
    panchayatInfo: {
      sarpanch: { type: String, default: 'Mukhiya Rajesh Kumar Verma' },
      upSarpanch: { type: String, default: 'Smt. Kaushalya Devi' },
      secretary: { type: String, default: 'Shri Anil Kumar Singh' },
      wardMembersCount: { type: Number, default: 12 },
      helpline: { type: String, default: '+91 98765 43210' },
      officeEmail: { type: String, default: 'panchayat@sundarpur-village.in' },
    },
    emergencyContacts: {
      police: { type: String, default: '112 / +91 94544 00100' },
      ambulance: { type: String, default: '108 / 102' },
      fire: { type: String, default: '101' },
      electricityBoard: { type: String, default: '1912' },
      womenHelpline: { type: String, default: '1090' },
      kisanCallCenter: { type: String, default: '1800-180-1551' },
    },
  },
  { timestamps: true }
);

export default mongoose.models.Village || mongoose.model('Village', VillageSchema);
