const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const protect = require("../middleware/authMiddleware");

// 🔹 CREATE TASK
router.post("/", protect, async (req, res) => {
  try {
    const { title, projectId, assignedTo } = req.body;

    const task = await Task.create({
      title,
      projectId,
      assignedTo, // 🔥 NEW
      completed: false
    });

    // 🔥 populate user name
    const populatedTask = await task.populate("assignedTo", "name");

    res.json(populatedTask);

  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});


// 🔹 GET TASKS BY PROJECT
router.get("/:projectId", protect, async (req, res) => {
  try {
    const tasks = await Task.find({
      projectId: req.params.projectId
    }).populate("assignedTo", "name"); // 🔥 IMPORTANT

    res.json(tasks);

  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});


// 🔹 TOGGLE TASK
router.put("/:id", protect, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ msg: "Not found" });

    task.completed = !task.completed;

    await task.save();

    const updated = await task.populate("assignedTo", "name");

    res.json(updated);

  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});


// 🔹 DELETE TASK
router.delete("/:id", protect, async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ msg: "Deleted" });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;