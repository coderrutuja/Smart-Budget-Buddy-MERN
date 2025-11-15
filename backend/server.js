// backend/server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const incomeRoutes = require("./routes/incomeRoutes")
const expenseRoutes = require("./routes/expenseRoutes")
const dashboardRoutes = require("./routes/dashboardRoutes")
const budgetRoutes = require("./routes/budgetRoutes");
const goalRoutes = require("./routes/goalRoutes");
const insightsRoutes = require("./routes/insightsRoutes");
const gamificationRoutes = require("./routes/gamificationRoutes");
const notificationsRoutes = require("./routes/notificationsRoutes");
const sheetsRoutes = require("./routes/sheetsRoutes");

// Middleware to handle CORS
app.use(
cors({
origin: process.env.CLIENT_URL || "*",
methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
allowedHeaders: ["Content-Type", "Authorization"],
optionsSuccessStatus: 204,
})
);

app.use(express.json());

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/income", incomeRoutes);
app.use("/api/expense", expenseRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/budgets", budgetRoutes);
app.use("/api/goals", goalRoutes);
app.use("/api/insights", insightsRoutes);
app.use("/api/gamification", gamificationRoutes);
app.use("/api/notifications", notificationsRoutes);
app.use("/api/sheets", sheetsRoutes);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));