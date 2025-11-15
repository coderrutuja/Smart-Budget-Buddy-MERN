const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    icon: { type: String },
    category: { type: String, required: true },  // Example: Food, rent, groceries
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    notes: { type: String, default: "" },
    tags: { type: [String], default: [] },
    receiptUrl: { type: String, default: null },
}, { timestamps: true });

module.exports = mongoose.model("Expense", ExpenseSchema);