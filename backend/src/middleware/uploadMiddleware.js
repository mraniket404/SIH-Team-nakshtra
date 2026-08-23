const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadDirectory = path.join(
  process.cwd(),
  "uploads"
);

if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, {
    recursive: true,
  });
}


/* =========================
   STORAGE
========================= */

const storage =
  multer.diskStorage({

    destination: (
      req,
      file,
      cb
    ) => {

      cb(
        null,
        uploadDirectory
      );
    },

    filename: (
      req,
      file,
      cb
    ) => {

      const extension =
        path
          .extname(
            file.originalname
          )
          .toLowerCase();

      const uniqueName =
        `${Date.now()}-${Math.round(
          Math.random() * 1e9
        )}${extension}`;

      cb(
        null,
        uniqueName
      );
    },
  });


/* =========================
   ALLOWED FILE TYPES
========================= */

const allowedExtensions = [
  ".tif",
  ".tiff",
];


const fileFilter = (
  req,
  file,
  cb
) => {

  const extension =
    path
      .extname(
        file.originalname
      )
      .toLowerCase();


  if (
    !allowedExtensions.includes(
      extension
    )
  ) {

    return cb(
      new Error(
        "Only GeoTIFF/TIFF files are supported for satellite imagery."
      )
    );
  }


  cb(
    null,
    true
  );
};


/* =========================
   MULTER
========================= */

const upload =
  multer({

    storage,

    fileFilter,

    limits: {

      // 1 GB per file
      fileSize:
        1024 *
        1024 *
        1024,

      // Maximum 2 satellite files
      files: 2,
    },
  });


module.exports =
  upload;