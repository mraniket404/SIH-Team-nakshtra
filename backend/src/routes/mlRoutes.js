const express = require("express");

const {
  inspectRaster,
  calculateNDVI,
  calculateBitemporalChange,
} = require("../services/mlService");

const router = express.Router();


/* =====================================================
   INSPECT RASTER
===================================================== */

router.post(
  "/inspect-raster",
  async (req, res) => {

    try {

      const {
        filePath,
      } = req.body;

      if (!filePath) {

        return res.status(400).json({
          success: false,
          message:
            "filePath is required",
        });

      }

      const result =
        await inspectRaster(
          filePath
        );

      return res.status(200).json(
        result
      );

    } catch (error) {

      console.error(
        "ML raster inspection error:",
        error.response?.data ||
        error.message
      );

      return res.status(500).json({

        success: false,

        message:
          "ML raster inspection failed",

        error:
          error.response?.data?.detail ||
          error.message,

      });
    }
  }
);


/* =====================================================
   NDVI
===================================================== */

router.post(
  "/ndvi",
  async (req, res) => {

    try {

      const {
        redFilePath,
        nirFilePath,
        analysisId,
      } = req.body;

      if (!redFilePath) {

        return res.status(400).json({
          success: false,
          message:
            "redFilePath is required",
        });

      }

      if (!nirFilePath) {

        return res.status(400).json({
          success: false,
          message:
            "nirFilePath is required",
        });

      }

      if (!analysisId) {

        return res.status(400).json({
          success: false,
          message:
            "analysisId is required",
        });

      }

      const result =
        await calculateNDVI(

          redFilePath,

          nirFilePath,

          analysisId

        );

      return res.status(200).json(
        result
      );

    } catch (error) {

      console.error(
        "ML NDVI processing error:",
        error.response?.data ||
        error.message
      );

      return res.status(500).json({

        success: false,

        message:
          "ML NDVI processing failed",

        error:
          error.response?.data?.detail ||
          error.message,

      });
    }
  }
);


/* =====================================================
   BI-TEMPORAL CHANGE DETECTION
===================================================== */

router.post(
  "/change",
  async (req, res) => {

    try {

      const {
        earlierFilePath,
        laterFilePath,
        analysisId,
        threshold,
      } = req.body;

      if (!earlierFilePath) {

        return res.status(400).json({
          success: false,
          message:
            "earlierFilePath is required",
        });

      }

      if (!laterFilePath) {

        return res.status(400).json({
          success: false,
          message:
            "laterFilePath is required",
        });

      }

      if (!analysisId) {

        return res.status(400).json({
          success: false,
          message:
            "analysisId is required",
        });

      }

      const result =
        await calculateBitemporalChange(

          earlierFilePath,

          laterFilePath,

          analysisId,

          threshold ?? 0.10

        );

      return res.status(200).json(
        result
      );

    } catch (error) {

      console.error(
        "ML bi-temporal change error:",
        error.response?.data ||
        error.message
      );

      return res.status(500).json({

        success: false,

        message:
          "ML bi-temporal change detection failed",

        error:
          error.response?.data?.detail ||
          error.message,

      });
    }
  }
);


/* =====================================================
   EXPORT
===================================================== */

module.exports = router;