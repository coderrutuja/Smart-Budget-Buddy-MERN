const Budget = require('../models/Budget');
const Expense = require('../models/Expense');

const startOfMonth = (year, month) => new Date(year, month, 1, 0, 0, 0, 0);
const endOfMonth = (year, month) => new Date(year, month + 1, 0, 23, 59, 59, 999);

const buildDateRange = (budget) => {
  if (budget.period === 'monthly' && budget.year != null && budget.month != null) {
    return { from: startOfMonth(budget.year, budget.month), to: endOfMonth(budget.year, budget.month) };
  }
  if (budget.startDate && budget.endDate) {
    return { from: new Date(budget.startDate), to: new Date(budget.endDate) };
  }
  return null;
};

const computeSpentForBudget = async (budget) => {
  const dateRange = buildDateRange(budget);
  const match = { userId: budget.userId };
  if (budget.category) match.category = budget.category;
  if (dateRange) match.date = { $gte: dateRange.from, $lte: dateRange.to };

  const agg = await Expense.aggregate([
    { $match: match },
    { $group: { _id: null, total: { $sum: '$amount' } } },
  ]);
  const spent = agg[0]?.total || 0;
  const utilization = budget.amount > 0 ? Math.min(100, Math.round((spent / budget.amount) * 100)) : 0;
  return { spent, utilization };
};

exports.createBudget = async (req, res) => {
  try {
    const userId = req.user.id;
    const payload = { ...req.body, userId };
    const budget = await Budget.create(payload);
    const computed = await computeSpentForBudget(budget);
    res.status(201).json({ ...budget.toObject(), ...computed });
  } catch (err) {
    res.status(500).json({ message: 'Error creating budget', error: err.message });
  }
};

exports.getBudgets = async (req, res) => {
  try {
    const userId = req.user.id;
    const budgets = await Budget.find({ userId }).sort({ createdAt: -1 });
    const results = await Promise.all(budgets.map(async (b) => {
      const computed = await computeSpentForBudget(b);
      return { ...b.toObject(), ...computed };
    }));
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching budgets', error: err.message });
  }
};

exports.updateBudget = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const updated = await Budget.findOneAndUpdate({ _id: id, userId }, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Budget not found' });
    const computed = await computeSpentForBudget(updated);
    res.json({ ...updated.toObject(), ...computed });
  } catch (err) {
    res.status(500).json({ message: 'Error updating budget', error: err.message });
  }
};

exports.deleteBudget = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const deleted = await Budget.findOneAndDelete({ _id: id, userId });
    if (!deleted) return res.status(404).json({ message: 'Budget not found' });
    res.json({ message: 'Budget deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting budget', error: err.message });
  }
};
