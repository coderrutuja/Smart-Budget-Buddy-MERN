const mongoose = require('mongoose');

const GoalSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    targetAmount: { type: Number, required: true },
    savedAmount: { type: Number, default: 0 },
    targetDate: { type: Date },
    status: { type: String, enum: ['active', 'completed', 'paused'], default: 'active' },
    color: { type: String, default: '#22c55e' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Goal', GoalSchema);
