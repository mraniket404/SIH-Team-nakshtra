const express = require("express");

const {
  createAnalysis,
  getAnalyses,
  getAnalysis,
} = require("../controllers/analysisController");

const {
  protect,
} = require("../middleware/authMiddleware");

const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

/* =========================
   AUTHENTICATION
========================= */

router.use(protect);


/* =========================
   CREATE ANALYSIS
========================= */

router.post(
  "/",
  upload.array("images", 20),
  createAnalysis
);


/* =========================
   GET ALL ANALYSES
========================= */

router.get(
  "/",
  getAnalyses
);


/* =========================
   GET SINGLE ANALYSIS
========================= */

router.get(
  "/:id",
  getAnalysis
);


module.exports = router;