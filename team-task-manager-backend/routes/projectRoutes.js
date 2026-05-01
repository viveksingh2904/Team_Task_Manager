const express = require("express");
const router = express.Router();
const Project = require("../models/Project");
const protect = require("../middleware/authMiddleware");


// 🔹 Create Project (ADMIN ONLY)
router.post("/", protect, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ msg: "Only admin can create project" });
    }

    const { name, description, team } = req.body;

    if (!name) {
      return res.status(400).json({ msg: "Project name required" });
    }

    const project = await Project.create({
      name,
      description,
      team,
      createdBy: req.user.id,
    });

    res.status(201).json(project);

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});


// 🔥 FIXED GET ROUTE
router.get("/", protect, async (req, res) => {
  try {
    let projects;

    if (req.user.role === "admin") {
      // admin → sab projects
      projects = await Project.find()
        .populate("team", "name email")
        .populate("createdBy", "name");

    } else {
      // 🔥 MEMBER FIX
      projects = await Project.find({
        $or: [
          { team: req.user.id },       // assigned projects
          { createdBy: req.user.id }   // apne banaye hue
        ]
      })
        .populate("team", "name email")
        .populate("createdBy", "name");
    }

    res.json(projects);

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;