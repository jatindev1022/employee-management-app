import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: String,
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  team: {
    type: String, // or mongoose.Schema.Types.ObjectId if referencing another model
    required: true,
  },
  members: [
    {
      type: String, // or mongoose.Schema.Types.ObjectId
      required: true,
    },
  ],
}, { timestamps: true });



export default mongoose.models.Project || mongoose.model('Project', ProjectSchema);