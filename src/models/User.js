import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  // New fields
  firstName: { type: String },
  lastName: { type: String },
  bio: { type: String, maxlength: 500 },
  phone: { type: String },
  team: { type: String },
  position: { type: String },
  location: { type: String },
  profileImage: { type: String }, // optional if you're storing an image URL
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', UserSchema);
