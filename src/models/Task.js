import mongoose from 'mongoose';

const TaskSchema = new mongoose.Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  assignee: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' // Assuming your user model is named 'User'
  }],
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  dueDate: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.models.Task || mongoose.model('Task', TaskSchema);

  