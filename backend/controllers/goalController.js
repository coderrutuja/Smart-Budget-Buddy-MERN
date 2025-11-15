const Goal = require('../models/Goal');

exports.createGoal = async (req, res) => {
  try {
    const userId = req.user.id;
    const payload = { ...req.body, userId };
    const goal = await Goal.create(payload);
    res.status(201).json(goal);
  } catch (err) {
    res.status(500).json({ message: 'Error creating goal', error: err.message });
  }
};

exports.getGoals = async (req, res) => {
  try {
    const userId = req.user.id;
    const goals = await Goal.find({ userId }).sort({ createdAt: -1 });
    res.json(goals);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching goals', error: err.message });
  }
};

exports.updateGoal = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const updated = await Goal.findOneAndUpdate({ _id: id, userId }, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Goal not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Error updating goal', error: err.message });
  }
};

exports.deleteGoal = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const deleted = await Goal.findOneAndDelete({ _id: id, userId });
    if (!deleted) return res.status(404).json({ message: 'Goal not found' });
    res.json({ message: 'Goal deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting goal', error: err.message });
  }
};
