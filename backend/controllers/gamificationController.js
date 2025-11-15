const Expense = require('../models/Expense');
const Income = require('../models/Income');
const Budget = require('../models/Budget');
const { Types } = require('mongoose');

const startOfMonth = (year, month) => new Date(year, month, 1, 0, 0, 0, 0);
const endOfMonth = (year, month) => new Date(year, month + 1, 0, 23, 59, 59, 999);

const buildBudgetDateRange = (budget) => {
  if (budget.period === 'monthly' && budget.year != null && budget.month != null) {
    return { from: startOfMonth(budget.year, budget.month), to: endOfMonth(budget.year, budget.month) };
  }
  if (budget.startDate && budget.endDate) {
    return { from: new Date(budget.startDate), to: new Date(budget.endDate) };
  }
  // fallback: current month
  const now = new Date();
  return { from: startOfMonth(now.getFullYear(), now.getMonth()), to: endOfMonth(now.getFullYear(), now.getMonth()) };
};

async function computeSpentForBudget(userId, budget) {
  const userObjectId = new Types.ObjectId(String(userId));
  const dateRange = buildBudgetDateRange(budget);
  const match = { userId: userObjectId };
  if (budget.category) match.category = budget.category;
  if (dateRange) match.date = { $gte: dateRange.from, $lte: dateRange.to };
  const agg = await Expense.aggregate([
    { $match: match },
    { $group: { _id: null, total: { $sum: '$amount' } } },
  ]);
  const spent = agg[0]?.total || 0;
  const utilization = budget.amount > 0 ? Math.round((spent / budget.amount) * 100) : 0;
  return { spent, utilization };
}

async function getConsecutiveLoggingStreak(userId) {
  const userObjectId = new Types.ObjectId(String(userId));
  // fetch last 30 days income/expense dates
  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const [inc, exp] = await Promise.all([
    Income.find({ userId: userObjectId, date: { $gte: since } }).select('date').lean(),
    Expense.find({ userId: userObjectId, date: { $gte: since } }).select('date').lean(),
  ]);
  const set = new Set([...inc, ...exp].map(x => new Date(new Date(x.date).toDateString()).getTime()));
  let streak = 0;
  for (let i = 0; i < 30; i++) {
    const day = new Date();
    day.setDate(day.getDate() - i);
    const key = new Date(day.toDateString()).getTime();
    if (set.has(key)) streak += 1; else break;
  }
  return streak;
}

exports.getGamification = async (req, res) => {
  try {
    const userId = req.user.id;
    const userObjectId = new Types.ObjectId(String(userId));
    const now = new Date();
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    // Under Budget badge: any active/current-month budget utilization < 80%
    const budgets = await Budget.find({ userId: userObjectId }).limit(20);
    const budgetBadges = [];
    for (const b of budgets) {
      const { spent, utilization } = await computeSpentForBudget(userId, b);
      const inCurrentMonth = (() => {
        const range = buildBudgetDateRange(b);
        return range && now >= range.from && now <= range.to;
      })();
      if (inCurrentMonth && utilization < (b.thresholdPercent || 90) && utilization <= 80) {
        budgetBadges.push({ id: `under-budget-${b._id}`, name: 'Under Budget', desc: `Stayed under 80% for ${b.name}`, earnedAt: new Date() });
      }
    }

    // No Dining Out Week: no expenses with category including dining/restaurant for 7 days
    const diningRegex = /dining|restaurant|eat\s*out/i;
    const diningCount = await Expense.countDocuments({ userId: userObjectId, date: { $gte: sevenDaysAgo }, category: { $regex: diningRegex } });
    const noDiningWeekBadge = diningCount === 0 ? [{ id: 'no-dining-week', name: 'No Dining Out Week', desc: 'No dining-out expenses in the last 7 days', earnedAt: new Date() }] : [];

    // Thrifty Week: last 7 days total < 75% of previous 7 days
    const prevWeekStart = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
    const [last7, prev7] = await Promise.all([
      Expense.aggregate([
        { $match: { userId: userObjectId, date: { $gte: sevenDaysAgo } } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
      Expense.aggregate([
        { $match: { userId: userObjectId, date: { $gte: prevWeekStart, $lt: sevenDaysAgo } } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
    ]);
    const last7Total = last7[0]?.total || 0;
    const prev7Total = prev7[0]?.total || 0;
    const thriftyWeekBadge = (prev7Total > 0 && last7Total < 0.75 * prev7Total)
      ? [{ id: 'thrifty-week', name: 'Thrifty Week', desc: 'Spent 25% less than the prior week', earnedAt: new Date() }]
      : [];

    const streakDays = await getConsecutiveLoggingStreak(userId);

    const badges = [...budgetBadges, ...noDiningWeekBadge, ...thriftyWeekBadge].slice(0, 8);

    res.json({ badges, streakDays });
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};
