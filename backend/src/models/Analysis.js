const mongoose = require("mongoose");


/* =====================================================
   RASTER METADATA SCHEMA
===================================================== */

const rasterMetadataSchema =
  new mongoose.Schema(
    {
      fileName: String,

      filename: String,

      format: String,

      width: Number,

      height: Number,

      band_count: Number,

      dtype: String,

      crs: String,

      resolution: {
        x: Number,
        y: Number,
      },

      bounds: {
        left: Number,
        bottom: Number,
        right: Number,
        top: Number,
      },

      transform: [
        Number,
      ],

      nodata:
        mongoose.Schema.Types.Mixed,

      /* =========================
         BAND INFORMATION
      ========================= */

      band: {
        type: String,
        default: "",
      },

      role: {
        type: String,
        default: "",
      },

      modality: {
        type: String,
        default: "unknown",
      },
    },

    {
      _id: false,
    }
  );


/* =====================================================
   ANALYSIS SCHEMA
===================================================== */

const analysisSchema =
  new mongoose.Schema(
    {
      /* =========================
         OWNER
      ========================= */

      owner: {
        type:
          mongoose.Schema.Types.ObjectId,

        ref: "User",

        required: true,

        index: true,
      },


      /* =========================
         PROJECT
      ========================= */

      project: {
        type:
          mongoose.Schema.Types.ObjectId,

        ref: "Project",

        required: true,

        index: true,
      },


      /* =========================
         INPUT TYPE
      ========================= */

      inputType: {
        type: String,

        enum: [
          "single",
          "cross-modal",
          "bi-temporal",
          "ndvi",
        ],

        required: true,
      },


      /* =========================
         UPLOADED FILES
      ========================= */

      files: [
        {
          originalName: {
            type: String,
            required: true,
          },

          storedName: {
            type: String,
            required: true,
          },

          path: {
            type: String,
            required: true,
          },

          mimeType: {
            type: String,
            required: true,
          },

          size: {
            type: Number,
            required: true,
          },


          /* =========================
             MODALITY
          ========================= */

          modality: {
            type: String,

            enum: [
              "optical",
              "multispectral",
              "sar",
              "unknown",
            ],

            default: "unknown",
          },


          /* =========================
             BAND
          ========================= */

          band: {
            type: String,

            default: "",
          },


          /* =========================
             BAND ROLE
          ========================= */

          role: {
            type: String,

            default: "",
          },
        },
      ],


      /* =========================
         NATURAL LANGUAGE QUERY
      ========================= */

      query: {
        type: String,

        trim: true,

        maxlength: 2000,

        default: "",
      },


      /* =========================
         ANALYSIS STATUS
      ========================= */

      status: {
        type: String,

        enum: [
          "uploaded",
          "validating",
          "ready",
          "processing",
          "completed",
          "failed",
        ],

        default: "uploaded",
      },


      /* =========================
         RASTER METADATA
      ========================= */

      rasterMetadata: [
        rasterMetadataSchema,
      ],


      /* =========================
         NDVI RESULT
      ========================= */

      ndviResult: {
        type:
          mongoose.Schema.Types.Mixed,

        default: null,
      },


      /* =========================
         BI-TEMPORAL CHANGE RESULT
      ========================= */

      changeResult: {
        type:
          mongoose.Schema.Types.Mixed,

        default: null,
      },


      /* =========================
         GENERAL METADATA
      ========================= */

      metadata: {
        width: Number,

        height: Number,

        bands: Number,

        crs: String,

        transform:
          mongoose.Schema.Types.Mixed,

        bounds:
          mongoose.Schema.Types.Mixed,

        dtype: String,
      },


      /* =========================
         ERROR MESSAGE
      ========================= */

      errorMessage: {
        type: String,

        default: "",
      },
    },

    {
      timestamps: true,
    }
  );


/* =====================================================
   INDEX
===================================================== */

analysisSchema.index({
  owner: 1,
  project: 1,
  createdAt: -1,
});


/* =====================================================
   MODEL
===================================================== */

module.exports =
  mongoose.model(
    "Analysis",
    analysisSchema
  );