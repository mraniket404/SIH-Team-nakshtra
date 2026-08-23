const fs = require("fs/promises");
const mongoose = require("mongoose");

const Analysis = require("../models/Analysis");
const Project = require("../models/Project");

const {
  inspectRaster,
  calculateNDVI,
} = require("../services/mlService");


/* =====================================================
   BAND DETECTION
===================================================== */

const detectBandInfo = (filename = "") => {
  const name = filename.toUpperCase();

  const bandPatterns = [
    {
      band: "B02",
      role: "Blue",
      modality: "multispectral",
    },
    {
      band: "B03",
      role: "Green",
      modality: "multispectral",
    },
    {
      band: "B04",
      role: "Red",
      modality: "multispectral",
    },
    {
      band: "B05",
      role: "Red Edge 1",
      modality: "multispectral",
    },
    {
      band: "B06",
      role: "Red Edge 2",
      modality: "multispectral",
    },
    {
      band: "B07",
      role: "Red Edge 3",
      modality: "multispectral",
    },
    {
      band: "B08",
      role: "NIR",
      modality: "multispectral",
    },
    {
      band: "B8A",
      role: "NIR Narrow",
      modality: "multispectral",
    },
    {
      band: "B09",
      role: "Water Vapour",
      modality: "multispectral",
    },
    {
      band: "B11",
      role: "SWIR 1",
      modality: "multispectral",
    },
    {
      band: "B12",
      role: "SWIR 2",
      modality: "multispectral",
    },
  ];

  for (const item of bandPatterns) {
    if (
      name.includes(`_${item.band}_`) ||
      name.includes(`_${item.band}.`) ||
      name.endsWith(`_${item.band}`)
    ) {
      return item;
    }
  }

  return {
    band: "",
    role: "",
    modality: "unknown",
  };
};


/* =====================================================
   CREATE ANALYSIS
===================================================== */

const createAnalysis = async (req, res) => {
  const uploadedFiles = req.files || [];

  let createdAnalysis = null;

  try {
    const {
      projectId,
      inputType,
      query,
    } = req.body;


    /* =================================================
       PROJECT VALIDATION
    ================================================= */

    if (
      !projectId ||
      !mongoose.Types.ObjectId.isValid(
        projectId
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Valid projectId is required.",
      });
    }


    const project =
      await Project.findOne({
        _id: projectId,
        owner: req.user._id,
      });


    if (!project) {
      return res.status(404).json({
        success: false,
        message:
          "Project not found.",
      });
    }


    /* =================================================
       INPUT TYPE VALIDATION
    ================================================= */

    const allowedInputTypes = [
      "single",
      "cross-modal",
      "bi-temporal",
      "ndvi",
    ];


    if (
      !allowedInputTypes.includes(
        inputType
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid analysis input type.",
      });
    }


    /* =================================================
       FILE VALIDATION
    ================================================= */

    if (
      uploadedFiles.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "At least one satellite image is required.",
      });
    }


    if (
      inputType === "single" &&
      uploadedFiles.length !== 1
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Single image analysis requires exactly one image.",
      });
    }


    if (
      inputType === "cross-modal" &&
      uploadedFiles.length !== 2
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Cross-modal analysis requires exactly two images.",
      });
    }


    if (
      inputType === "bi-temporal" &&
      uploadedFiles.length !== 2
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Bi-temporal analysis requires exactly two images.",
      });
    }


    if (
      inputType === "ndvi" &&
      uploadedFiles.length !== 2
    ) {
      return res.status(400).json({
        success: false,
        message:
          "NDVI analysis requires exactly two images: B04 and B08.",
      });
    }


    /* =================================================
       BAND DETECTION
    ================================================= */

    const detectedFiles =
      uploadedFiles.map(
        (file) => {

          const bandInfo =
            detectBandInfo(
              file.originalname
            );

          return {
            file,
            bandInfo,
          };
        }
      );


    /* =================================================
       NDVI BAND VALIDATION
    ================================================= */

    let redFile = null;
    let nirFile = null;


    if (
      inputType === "ndvi"
    ) {

      redFile =
        detectedFiles.find(
          ({ bandInfo }) =>
            bandInfo.band === "B04"
        )?.file || null;


      nirFile =
        detectedFiles.find(
          ({ bandInfo }) =>
            bandInfo.band === "B08"
        )?.file || null;


      if (
        !redFile ||
        !nirFile
      ) {

        return res.status(400).json({

          success: false,

          message:
            "NDVI requires one B04 (Red) band and one B08 (NIR) band.",

          detectedBands:
            detectedFiles.map(
              ({
                file,
                bandInfo,
              }) => ({
                fileName:
                  file.originalname,

                band:
                  bandInfo.band ||
                  null,

                role:
                  bandInfo.role ||
                  null,
              })
            ),
        });
      }
    }


    /* =================================================
       FILE METADATA
    ================================================= */

    const files =
      detectedFiles.map(
        ({
          file,
          bandInfo,
        }) => ({

          originalName:
            file.originalname,

          storedName:
            file.filename,

          path:
            file.path,

          mimeType:
            file.mimetype ||
            "application/octet-stream",

          size:
            file.size,

          modality:
            bandInfo.modality,

          band:
            bandInfo.band,

          role:
            bandInfo.role,
        })
      );


    /* =================================================
       RASTER INSPECTION
    ================================================= */

    const rasterResults = [];


    for (
      const file
      of uploadedFiles
    ) {

      const result =
        await inspectRaster(
          file.path
        );


      const bandInfo =
        detectBandInfo(
          file.originalname
        );


      rasterResults.push({

        fileName:
          file.originalname,

        band:
          bandInfo.band,

        role:
          bandInfo.role,

        modality:
          bandInfo.modality,

        ...result.metadata,
      });
    }


    /* =================================================
       CREATE ANALYSIS FIRST
       
       IMPORTANT:
       MongoDB generates the analysis ID here.
    ================================================= */

    createdAnalysis =
      await Analysis.create({

        owner:
          req.user._id,

        project:
          project._id,

        inputType,

        files,

        query:
          typeof query === "string"
            ? query.trim()
            : "",

        status:
          inputType === "ndvi"
            ? "processing"
            : "uploaded",

        rasterMetadata:
          rasterResults,

        ndviResult:
          null,

      });


    /* =================================================
       NDVI PROCESSING
    ================================================= */

    let ndviResult = null;


    if (
      inputType === "ndvi"
    ) {

      ndviResult =
        await calculateNDVI(

          redFile.path,

          nirFile.path,

          createdAnalysis._id.toString()

        );


      /* ===============================================
         UPDATE ANALYSIS WITH NDVI RESULT
      =============================================== */

      createdAnalysis =
        await Analysis.findByIdAndUpdate(

          createdAnalysis._id,

          {
            status:
              "completed",

            ndviResult:
              ndviResult?.analysis ||
              ndviResult,

          },

          {
            new: true,
          }

        ).populate(
          "project",
          "name location"
        );

    }


    /* =================================================
       RESPONSE
    ================================================= */

    return res.status(201).json({

      success: true,

      message:
        ndviResult
          ? "Satellite imagery uploaded and NDVI analysis completed successfully."
          : "Satellite imagery uploaded and validated successfully.",

      analysis:
        createdAnalysis,

      rasterMetadata:
        rasterResults,

      ndviResult,

    });


  } catch (error) {

    console.error(
      "Create analysis error:",
      error.response?.data ||
        error.message ||
        error
    );


    /* =================================================
       MARK ANALYSIS FAILED
    ================================================= */

    if (
      createdAnalysis?._id
    ) {

      try {

        await Analysis.findByIdAndUpdate(
          createdAnalysis._id,
          {
            status: "failed",

            errorMessage:
              error.response?.data
                ?.detail ||
              error.message ||
              "Analysis processing failed.",
          }
        );

      } catch (
        updateError
      ) {

        console.error(
          "Failed to update analysis status:",
          updateError
        );

      }

    }


    /* =================================================
       FILE CLEANUP
    ================================================= */

    await Promise.all(
      uploadedFiles.map(
        async (file) => {

          try {

            await fs.unlink(
              file.path
            );

          } catch {

            // File may already be removed.

          }

        }
      )
    );


    return res.status(500).json({

      success: false,

      message:
        "Unable to create analysis.",

      error:
        error.response?.data?.detail ||
        error.message,

    });

  }
};


/* =====================================================
   GET ALL ANALYSES
===================================================== */

const getAnalyses =
  async (req, res) => {

    try {

      const analyses =
        await Analysis.find({

          owner:
            req.user._id,

        })
          .populate(
            "project",
            "name location"
          )
          .sort({
            createdAt: -1,
          });


      return res.status(200).json({

        success: true,

        count:
          analyses.length,

        analyses,

      });


    } catch (error) {

      console.error(
        "Get analyses error:",
        error
      );


      return res.status(500).json({

        success: false,

        message:
          "Unable to fetch analyses.",

      });

    }
  };


/* =====================================================
   GET SINGLE ANALYSIS
===================================================== */

const getAnalysis =
  async (req, res) => {

    try {

      const {
        id,
      } = req.params;


      if (
        !mongoose.Types.ObjectId.isValid(
          id
        )
      ) {

        return res.status(400).json({

          success: false,

          message:
            "Invalid analysis ID.",

        });

      }


      const analysis =
        await Analysis.findOne({

          _id: id,

          owner:
            req.user._id,

        }).populate(
          "project",
          "name location"
        );


      if (!analysis) {

        return res.status(404).json({

          success: false,

          message:
            "Analysis not found.",

        });

      }


      return res.status(200).json({

        success: true,

        analysis,

      });


    } catch (error) {

      console.error(
        "Get analysis error:",
        error
      );


      return res.status(500).json({

        success: false,

        message:
          "Unable to fetch analysis.",

      });

    }
  };


/* =====================================================
   EXPORTS
===================================================== */

module.exports = {
  createAnalysis,
  getAnalyses,
  getAnalysis,
};