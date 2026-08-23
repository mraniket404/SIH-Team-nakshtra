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
   EXPORTS
===================================================== */

module.exports = {
  inspectRaster,
  calculateNDVI,
};