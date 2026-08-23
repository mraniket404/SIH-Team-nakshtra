const axios = require("axios");

const ML_SERVICE_URL =
  process.env.ML_SERVICE_URL ||
  "http://127.0.0.1:8000";


/* =====================================================
   INSPECT RASTER
===================================================== */

const inspectRaster = async (
  filePath
) => {

  const response =
    await axios.post(
      `${ML_SERVICE_URL}/raster/inspect`,
      null,
      {
        params: {
          file_path: filePath,
        },

        timeout: 120000,
      }
    );

  return response.data;
};


/* =====================================================
   CALCULATE NDVI
===================================================== */

const calculateNDVI = async (
  redFilePath,
  nirFilePath,
  analysisId
) => {

  if (!analysisId) {

    throw new Error(
      "Analysis ID is required for NDVI processing."
    );

  }

  const response =
    await axios.post(
      `${ML_SERVICE_URL}/raster/ndvi`,
      null,
      {
        params: {

          red_file_path:
            redFilePath,

          nir_file_path:
            nirFilePath,

          analysis_id:
            analysisId,

        },

        timeout: 300000,
      }
    );

  return response.data;
};


/* =====================================================
   CALCULATE BI-TEMPORAL CHANGE
===================================================== */

const calculateBitemporalChange = async (
  earlierFilePath,
  laterFilePath,
  analysisId,
  threshold = 0.10
) => {

  if (!earlierFilePath) {

    throw new Error(
      "Earlier raster file path is required."
    );

  }

  if (!laterFilePath) {

    throw new Error(
      "Later raster file path is required."
    );

  }

  if (!analysisId) {

    throw new Error(
      "Analysis ID is required for "
      + "bi-temporal change detection."
    );

  }

  const response =
    await axios.post(
      `${ML_SERVICE_URL}/raster/change`,
      null,
      {
        params: {

          earlier_file_path:
            earlierFilePath,

          later_file_path:
            laterFilePath,

          analysis_id:
            analysisId,

          threshold:
            threshold,

        },

        timeout: 300000,
      }
    );

  return response.data;
};


/* =====================================================
   EXPORTS
===================================================== */

module.exports = {

  inspectRaster,

  calculateNDVI,

  calculateBitemporalChange,

};