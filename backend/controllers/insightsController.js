const Expense = require('../models/Expense');
const Income = require('../models/Income');
const { Types } = require('mongoose');

const monthsBack = (n) => {
  const d = new Date();
  d.setMonth(d.getMonth() - n);
  d.setHours(0,0,0,0);
  return d;
};

exports.getCategorySummary = async (req, res) => {
  try {
    const userId = new Types.ObjectId(String(req.user.id));
    const since = monthsBack(1); // last 1 month summary
    const agg = await Expense.aggregate([
      { $match: { userId, date: { $gte: since } } },
      { $group: { _id: '$category', total: { $sum: '$amount' } } },
      { $project: { _id: 0, category: '$_id', total: 1 } },
      { $sort: { total: -1 } },
    ]);
    res.json(agg);
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

exports.getMonthlyTrend = async (req, res) => {
  try {
    const userId = new Types.ObjectId(String(req.user.id));
    const since = monthsBack(5); // last 6 months including current
    const pipeline = (Model) => ([
      { $match: { userId, date: { $gte: since } } },
      { $group: {
        _id: { y: { $year: '$date' }, m: { $month: '$date' } },
        total: { $sum: '$amount' },
      }},
      { $project: { _id: 0, year: '$_id.y', month: '$_id.m', total: 1 } },
      { $sort: { year: 1, month: 1 } },
    ]);

    const [expense, income] = await Promise.all([
      Expense.aggregate(pipeline(Expense)),
      Income.aggregate(pipeline(Income)),
    ]);

    res.json({ income, expense });
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

exports.getInsights = async (req, res) => {
  try {
    const userId = new Types.ObjectId(String(req.user.id));
    const thisMonthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const lastMonthStart = new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1);
    const lastMonthEnd = new Date(new Date().getFullYear(), new Date().getMonth(), 0, 23, 59, 59, 999);

    // Totals by category for this and last month
    const byCategory = async (from, to) => Expense.aggregate([
      { $match: { userId, date: { $gte: from, $lte: to } } },
      { $group: { _id: '$category', total: { $sum: '$amount' } } },
      { $project: { _id: 0, category: '$_id', total: 1 } },
    ]);

    const [thisMonth, prevMonth] = await Promise.all([
      byCategory(thisMonthStart, new Date()),
      byCategory(lastMonthStart, lastMonthEnd),
    ]);

    const mapTotals = (arr) => Object.fromEntries(arr.map((x) => [x.category, x.total]));
    const thisMap = mapTotals(thisMonth);
    const prevMap = mapTotals(prevMonth);

    // Simple tips comparing MoM
    const tips = Object.keys(thisMap).map((cat) => {
      const curr = thisMap[cat] || 0;
      const prev = prevMap[cat] || 0;
      if (prev === 0 && curr > 0) {
        return `New spending in ${cat} this month. Consider setting a budget if this will recur.`;
      }
      if (prev > 0 && curr > prev) {
        const pct = Math.round(((curr - prev) / prev) * 100);
        return `You spent ${pct}% more on ${cat} this month. Consider limiting it next month.`;
      }
      return null;
    }).filter(Boolean).slice(0, 5);

    // Forecast next month total expenses using 3-month moving average
    const since = monthsBack(5);
    const monthly = await Expense.aggregate([
      { $match: { userId, date: { $gte: since } } },
      { $group: { _id: { y: { $year: '$date' }, m: { $month: '$date' } }, total: { $sum: '$amount' } } },
      { $project: { _id: 0, year: '$_id.y', month: '$_id.m', total: 1 } },
      { $sort: { year: 1, month: 1 } },
    ]);
    const totals = monthly.map((x) => x.total);
    const last3 = totals.slice(-3);
    const forecast = last3.length ? Math.round(last3.reduce((a,b)=>a+b,0) / last3.length) : 0;

    res.json({ tips, forecast });
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};
