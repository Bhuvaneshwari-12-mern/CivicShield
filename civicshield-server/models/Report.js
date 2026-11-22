import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  severity: { type: String, required: true },
  imageUrl: { type: String }, // <-- Added for image
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true },
  },
  status: { type: String, default: 'Pending' }
}, { timestamps: true });

reportSchema.index({ location: '2dsphere' });

export const Report = mongoose.model('Report', reportSchema);