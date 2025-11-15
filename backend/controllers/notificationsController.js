const Budget = require('../models/Budget');
const Expense = require('../models/Expense');
const { Types } = require('mongoose');

const startOfMonth = (y, m) => new Date(y, m, 1, 0, 0, 0, 0);
const endOfMonth = (y, m) => new Date(y, m + 1, 0, 23, 59, 59, 999);

const buildDateRange = (budget) => {
  if (budget.period === 'monthly' && budget.year != null && budget.month != null) {
    return { from: startOfMonth(budget.year, budget.month), to: endOfMonth(budget.year, budget.month) };
  }
  if (budget.startDate && budget.endDate) {
    return { from: new Date(budget.startDate), to: new Date(budget.endDate) };
  }
  const now = new Date();
  return { from: startOfMonth(now.getFullYear(), now.getMonth()), to: endOfMonth(now.getFullYear(), now.getMonth()) };
};

async function computeSpent(userId, budget) {
  const userObjectId = new Types.ObjectId(String(userId));
  const range = buildDateRange(budget);
  const match = { userId: userObjectId };
  if (budget.category) match.category = budget.category;
  if (range) match.date = { $gte: range.from, $lte: range.to };
  const agg = await Expense.aggregate([
    { $match: match },
    { $group: { _id: null, total: { $sum: '$amount' } } },
  ]);
  const spent = agg[0]?.total || 0;
  const utilization = budget.amount > 0 ? Math.round((spent / budget.amount) * 100) : 0;
  return { spent, utilization };
}

exports.getNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const userObjectId = new Types.ObjectId(String(userId));

    const budgets = await Budget.find({ userId: userObjectId }).limit(50);
    const notifications = [];

    for (const b of budgets) {
      const { spent, utilization } = await computeSpent(userId, b);
      const threshold = b.thresholdPercent || 90;
      if (utilization >= threshold) {
        notifications.push({
          id: `budget-${b._id}`,
          type: 'budget_threshold',
          title: 'Budget limit warning',
          body: `${b.name} is at ${utilization}% (₹${spent} / ₹${b.amount}).`,
          createdAt: new Date(),
          read: false,
        });
      }
    }

    res.json({ notifications });
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};
