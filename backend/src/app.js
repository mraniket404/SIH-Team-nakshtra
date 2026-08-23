const express = require("express");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/authRoutes");
const projectRoutes = require("./routes/projectRoutes");
const analysisRoutes = require("./routes/analysisRoutes");
const mlRoutes = require("./routes/mlRoutes");

const app = express();


/* =====================================================
   CORS
===================================================== */

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);


/* =====================================================
   BODY PARSERS
===================================================== */

app.use(
  express.json({
    limit: "2mb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
  })
);


/* =====================================================
   STATIC BACKEND UPLOADS
===================================================== */

/*
 * Project:
 *
 * backend/
 *   uploads/
 *
 * Browser:
 *
 * http://localhost:5000/uploads/...
 */

const UPLOADS_PATH = path.resolve(
  process.cwd(),
  "uploads"
);

app.use(
  "/uploads",
  express.static(
    UPLOADS_PATH
  )
);


/* =====================================================
   STATIC ML OUTPUTS
===================================================== */

/*
 * Project:
 *
 * satquery-ai/
 *
 * ├── backend/
 * │   └── uploads/
 * │
 * └── ml/
 *     └── outputs/
 *         └── ndvi/
 *             └── <analysis_id>/
 *                 ├── ndvi_result.tif
 *                 └── ndvi_preview.png
 *
 *
 * Browser:
 *
 * http://localhost:5000/ml-outputs/ndvi/
 * <analysis_id>/ndvi_preview.png
 */

const ML_OUTPUTS_PATH =
  path.resolve(
    process.cwd(),
    "..",
    "ml",
    "outputs"
  );

app.use(
  "/ml-outputs",
  express.static(
    ML_OUTPUTS_PATH
  )
);


/* =====================================================
   HEALTH CHECK
===================================================== */

app.get(
  "/api/health",
  (req, res) => {

    res.status(200).json({
      success: true,
      service: "satquery-backend",
      status: "healthy",
    });

  }
);


/* =====================================================
   API ROUTES
===================================================== */

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/projects",
  projectRoutes
);

app.use(
  "/api/analyses",
  analysisRoutes
);

app.use(
  "/api/ml",
  mlRoutes
);


/* =====================================================
   404 HANDLER
===================================================== */

app.use(
  (req, res) => {

    res.status(404).json({
      success: false,
      message:
        "API route not found.",
    });

  }
);


/* =====================================================
   GLOBAL ERROR HANDLER
===================================================== */

app.use(
  (
    error,
    req,
    res,
    next
  ) => {

    console.error(
      "Unhandled error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        error.message ||
        "Internal server error.",
    });

  }
);


module.exports = app;