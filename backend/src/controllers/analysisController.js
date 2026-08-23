const fs = require("fs/promises");
const mongoose = require("mongoose");

const Analysis = require("../models/Analysis");
const Project = require("../models/Project");

const {
  inspectRaster,
  calculateNDVI,
  calculateBitemporalChange,
} = require("../services/mlService");


/* =====================================================
   BAND DETECTION
===================================================== */

const detectBandInfo = (filename = "") => {

  const name =
    filename.toUpperCase();


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
   YEAR DETECTION
===================================================== */

const detectYear = (filename = "") => {

  const match =
    filename.match(
      /(19|20)\d{2}/
    );


  if (!match) {
    return null;
  }


  return Number(
    match[0]
  );
};


/* =====================================================
   CREATE ANALYSIS
===================================================== */

const createAnalysis = async (
  req,
  res
) => {

  const uploadedFiles =
    req.files || [];

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
       FILE EXISTENCE
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


    /* =================================================
       FILE COUNT VALIDATION
    ================================================= */

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


    /*
      IMPORTANT:

      Bi-temporal now requires:

      2017 B04
      2017 B08
      2024 B04
      2024 B08
    */

    if (
      inputType === "bi-temporal" &&
      uploadedFiles.length !== 4
    ) {

      return res.status(400).json({

        success: false,

        message:
          "Bi-temporal analysis requires exactly 4 images: 2017 B04, 2017 B08, 2024 B04 and 2024 B08.",

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
       DETECT BANDS
    ================================================= */

    const detectedFiles =
      uploadedFiles.map(
        (file) => {

          const bandInfo =
            detectBandInfo(
              file.originalname
            );


          const year =
            detectYear(
              file.originalname
            );


          return {

            file,

            bandInfo,

            year,

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
       BI-TEMPORAL FILE ORGANIZATION
    ================================================= */

    let earlierB04 = null;
    let earlierB08 = null;

    let laterB04 = null;
    let laterB08 = null;


    if (
      inputType === "bi-temporal"
    ) {

      /*
        Find files using BOTH:

        year + band
      */

      earlierB04 =
        detectedFiles.find(
          ({ bandInfo, year }) =>
            year === 2017 &&
            bandInfo.band === "B04"
        )?.file || null;


      earlierB08 =
        detectedFiles.find(
          ({ bandInfo, year }) =>
            year === 2017 &&
            bandInfo.band === "B08"
        )?.file || null;


      laterB04 =
        detectedFiles.find(
          ({ bandInfo, year }) =>
            year === 2024 &&
            bandInfo.band === "B04"
        )?.file || null;


      laterB08 =
        detectedFiles.find(
          ({ bandInfo, year }) =>
            year === 2024 &&
            bandInfo.band === "B08"
        )?.file || null;


      if (
        !earlierB04 ||
        !earlierB08 ||
        !laterB04 ||
        !laterB08
      ) {

        return res.status(400).json({

          success: false,

          message:
            "Bi-temporal analysis requires exactly: 2017 B04, 2017 B08, 2024 B04 and 2024 B08.",

          detectedFiles:
            detectedFiles.map(
              ({
                file,
                bandInfo,
                year,
              }) => ({

                fileName:
                  file.originalname,

                year,

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
          year,
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

          year,

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


      const year =
        detectYear(
          file.originalname
        );


      rasterResults.push({

        fileName:
          file.originalname,

        year,

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
       CREATE ANALYSIS
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
          inputType === "ndvi" ||
          inputType === "bi-temporal"
            ? "processing"
            : "uploaded",

        rasterMetadata:
          rasterResults,

        ndviResult:
          null,

        changeResult:
          null,

      });


    /* =================================================
       NDVI
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
       BI-TEMPORAL NDVI + CHANGE DETECTION
    ================================================= */

    let earlierNDVI = null;

    let laterNDVI = null;

    let changeResult = null;


    if (
      inputType === "bi-temporal"
    ) {

      /* ===============================================
         STEP 1
         Calculate NDVI for 2017
      =============================================== */

      earlierNDVI =
        await calculateNDVI(

          earlierB04.path,

          earlierB08.path,

          `${createdAnalysis._id.toString()}_2017`

        );


      /* ===============================================
         STEP 2
         Calculate NDVI for 2024
      =============================================== */

      laterNDVI =
        await calculateNDVI(

          laterB04.path,

          laterB08.path,

          `${createdAnalysis._id.toString()}_2024`

        );


      /* ===============================================
         Extract generated NDVI raster paths
      =============================================== */

      const earlierAnalysis =
        earlierNDVI?.analysis ||
        earlierNDVI;


      const laterAnalysis =
        laterNDVI?.analysis ||
        laterNDVI;


      const earlierNDVIPath =
        earlierAnalysis?.output_file ||
        earlierAnalysis?.outputFile;


      const laterNDVIPath =
        laterAnalysis?.output_file ||
        laterAnalysis?.outputFile;


      if (
        !earlierNDVIPath ||
        !laterNDVIPath
      ) {

        throw new Error(
          "NDVI processing completed but generated raster paths were not returned."
        );
      }


      /* ===============================================
         STEP 3
         Compare 2017 NDVI vs 2024 NDVI
      =============================================== */

      changeResult =
        await calculateBitemporalChange(

          earlierNDVIPath,

          laterNDVIPath,

          createdAnalysis._id.toString(),

          0.10

        );


      /* ===============================================
         STEP 4
         SAVE COMPLETE BI-TEMPORAL RESULT
      =============================================== */

      createdAnalysis =
        await Analysis.findByIdAndUpdate(

          createdAnalysis._id,

          {

            status:
              "completed",

            ndviResult: {

              earlier: earlierAnalysis,

              later: laterAnalysis,

            },

            changeResult:
              changeResult?.analysis ||
              changeResult,

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

          : changeResult

            ? "Satellite imagery uploaded and bi-temporal vegetation change analysis completed successfully."

            : "Satellite imagery uploaded and validated successfully.",


      analysis:
        createdAnalysis,


      rasterMetadata:
        rasterResults,


      ndviResult,

      earlierNDVI,

      laterNDVI,

      changeResult,

    });


  } catch (error) {

    console.error(

      "Create analysis error:",

      error.response?.data ||

      error.message ||

      error

    );


    /* =================================================
       MARK FAILED
    ================================================= */

    if (
      createdAnalysis?._id
    ) {

      try {

        await Analysis.findByIdAndUpdate(

          createdAnalysis._id,

          {

            status:
              "failed",

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
  async (
    req,
    res
  ) => {

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
  async (
    req,
    res
  ) => {

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

        })

          .populate(
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