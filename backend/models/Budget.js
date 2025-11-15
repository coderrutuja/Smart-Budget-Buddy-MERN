const mongoose = require('mongoose');

const BudgetSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    category: { type: String, default: null }, // null => overall budget
    period: { type: String, enum: ['monthly', 'weekly', 'custom'], default: 'monthly' },
    startDate: { type: Date },
    endDate: { type: Date },
    month: { type: Number, min: 0, max: 11 }, // optional if monthly
    year: { type: Number },
    amount: { type: Number, required: true },
    thresholdPercent: { type: Number, default: 90 }, // notify when utilization crosses this
    color: { type: String, default: '#3b82f6' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Budget', BudgetSchema);
