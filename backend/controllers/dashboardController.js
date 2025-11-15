// backend/controllers/dashboardController.js
const Income = require('../models/Income');
const Expense = require('../models/Expense');
const { isValidObjectId, Types } = require('mongoose');

// Dashboard Data
exports.getDashboardData = async (req, res) => {
  try {
    const userId = req.user.id;
    const userObjectId = new Types.ObjectId(String(userId));

    // Fetch total income & expenses
    const totalIncome = await Income.aggregate([
      { $match: { userId: userObjectId } }, // ✅ fixed typo ($userId → userId)
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const totalExpense = await Expense.aggregate([
      { $match: { userId: userObjectId } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    // Get income transactions in the last 60 days
    const last60DaysIncomeTransactions = await Income.find({
      userId,
      date: { $gte: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000) }, // ✅ fixed typo (*1000)
    }).sort({ date: -1 });

    // Get total income for last 60 days
    const incomeLast60Days = last60DaysIncomeTransactions.reduce(
      (sum, transaction) => sum + transaction.amount,
      0
    );

    // Get expense transactions in the last 30 days
    const last30DayExpenseTransactions = await Expense.find({
      userId,
      date: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }, // ✅ fixed typo Date,now()
    }).sort({ date: -1 });

    // Get total expenses for last 30 days
    const expensesLast30Days = last30DayExpenseTransactions.reduce(
      (sum, transaction) => sum + transaction.amount,
      0
    );

    // Fetch last 5 transactions (income + expenses)
    const lastTransactions = [
      ...(await Income.find({ userId }).sort({ date: -1 }).limit(5)).map((txn) => ({
        ...txn.toObject(), // ✅ fixed toObject typo
        type: "income",
      })),
      ...(await Expense.find({ userId }).sort({ date: -1 }).limit(5)).map((txn) => ({
        ...txn.toObject(),
        type: "expense",
      })),
    ].sort((a, b) => new Date(b.date) - new Date(a.date));

    // ✅ Final Response
    res.json({
      totalBalance:
        (totalIncome[0]?.total || 0) - (totalExpense[0]?.total || 0),
      totalIncome: totalIncome[0]?.total || 0,
      totalExpenses: totalExpense[0]?.total || 0,
      last30DaysExpenses: {
        total: expensesLast30Days,
        transactions: last30DayExpenseTransactions,
      },
      last60DaysIncome: {
        total: incomeLast60Days,
        transactions: last60DaysIncomeTransactions,
      },
      recentTransactions: lastTransactions,
    });
  } catch (error) {
    console.error("Error in getDashboardData:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};


// const Income = require('../models/Income');
// const Expense = require('../models/Expense');
// const { isValidObjectId, Types } = require('mongoose');

// // Dashboard Data
// exports.getDashboardData = async (req, res) => {
//     try {
//         const userId = req.user.id;
//         const userObjectId = new Types.ObjectId(String(userId));

//         // Fetch total income & expenses
//         const totalIncome = await Income.aggregate([
//             { $match: { $userId: userObjectId }},
//             { $group: { _id: null, total: { $sum: "$amount" } } },
//         ]);

//         console.log("totalIncome", {totalIncome, userId: isValidObjectId(userId)});

//         const totalExpense = await Expense.aggregate([
//             { $match: { userId: userObjectId } },
//             { $group: { _id: null, total: { $sum: "$amount" } } },
//         ]);

//         // Get income transactions in the last 60 days
//         const last60DaysIncomeTransactions = await Income.find({
//             userId,
//             date: { $gte: new Date(Date.now() - 60 * 24 * 60 * 60 * 100) },
//         }).sort({ date: -1 });

//         // Get total income for last 60 days
//         const incomeLast60Days = last60DaysIncomeTransactions.reduce(
//             (sum, transaction) => sum + transaction.amount,
//             0
//         );

//         // Get expense transactions in the last 30 days
//         const last30DaysIncomeTransactions = await Expense.find({
//             userId,
//             date: { $gte: new Date(Date,now() - 30 * 24 * 60 * 60 * 1000) },
//         }).sort({ date: -1 });

//         // Get total expenses for last 30 days
//         const expenseLast30Days = last30DaysIncomeTransactions.reduce(
//             (sum, transaction) => sum + transaction.amount,
//             0
//         );

//         // Fetch last 5 transactions (income + expenses)
//         const lastTransactions = [
//             ...((await Income.find({ userId })).sort({ date: -1 }).limit(5)).map(
//                 (txn) => ({
//                     ...txn.toOject(),
//                     type: "income",
//                 })
//             ),
//             ...((await Expense.find({ userId })).sort({ date: -1 }).limit(5)).map(
//                 (txn) => ({
//                     ...txn.toOject(),
//                     type: "expense",
//                 })
//             ),
//         ].sort((a,b) => b.date - a.date); // Sort latest first

//         // Final Response
//         res.json({
//             totalBalance:
//                 (totalIncome[0]?.total || 0) - (totalExpense[0]?.total || 0),
//             totalIncome: totalIncome[0]?.total || 0,
//             totalExpenses: totalExpense[0]?.total || 0,
//             last30DaysExpenses: {
//                 total: expensesLast30Days,
//                 transactions: last30DayExpenseTransactions
//             },  
//             last60DaysIncome: {
//                 total: incomeLast60Days,
//                 transactions: last60DaysIncomeTransactions,
//             },
//             recentTransactions: lastTransactions, 
//         });
//     }
//     catch (error) {
//         res.status(500).json({ message: "Server Error ", error });
//     }
// };