const express = require("express");

const {
  inspectRaster,
} = require("../services/mlService");

const router = express.Router();

router.post("/inspect-raster", async (req, res) => {
  try {
    const { filePath } = req.body;

    if (!filePath) {
      return res.status(400).json({
        success: false,
        message: "filePath is required",
      });
    }

    const result = await inspectRaster(filePath);

    return res.status(200).json(result);
  } catch (error) {
    console.error(
      "ML raster inspection error:",
      error.response?.data || error.message
    );

    return res.status(500).json({
      success: false,
      message: "ML raster inspection failed",
      error:
        error.response?.data?.detail ||
        error.message,
    });
  }
});

module.exports = router;