const express = require("express");

const {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
  getProjectStats,
} = require("../controllers/projectController");

const {
  protect,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);

router.get("/stats", getProjectStats);

router.post("/", createProject);

router.get("/", getProjects);

router.get("/:id", getProject);

router.patch("/:id", updateProject);

router.delete("/:id", deleteProject);

module.exports = router;