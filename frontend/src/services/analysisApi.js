const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";


/* =========================
   CREATE ANALYSIS
========================= */

export const createAnalysis = async ({
  projectId,
  inputType,
  query,
  files,
  token,
  onUploadProgress,
}) => {

  if (!token) {
    throw new Error(
      "Authentication token is missing. Please login again."
    );
  }


  if (!projectId) {
    throw new Error(
      "Project ID is required."
    );
  }


  if (!files || files.length === 0) {
    throw new Error(
      "At least one TIFF file is required."
    );
  }


  const formData =
    new FormData();


  formData.append(
    "projectId",
    projectId
  );


  formData.append(
    "inputType",
    inputType
  );


  formData.append(
    "query",
    query || ""
  );


  files.forEach(
    (file) => {
      formData.append(
        "images",
        file
      );
    }
  );


  /*
   * fetch() does not support upload progress.
   *
   * We keep onUploadProgress in the API
   * signature so the UI remains compatible.
   *
   * Actual upload progress can be implemented
   * later with XMLHttpRequest/Axios.
   */


  const response =
    await fetch(
      `${API_BASE_URL}/analyses`,
      {
        method: "POST",

        headers: {
          Authorization:
            `Bearer ${token}`,
        },

        body: formData,
      }
    );


  let data = null;

  try {
    data =
      await response.json();
  } catch {
    data = null;
  }


  if (
    response.status === 401
  ) {
    throw new Error(
      "Authentication expired. Please logout and login again."
    );
  }


  if (!response.ok) {

    throw new Error(
      data?.message ||
      data?.error ||
      "Unable to create analysis."
    );
  }


  if (
    typeof onUploadProgress ===
    "function"
  ) {
    onUploadProgress({
      loaded: 1,
      total: 1,
    });
  }


  return data;
};


/* =========================
   GET ALL ANALYSES
========================= */

export const getAnalyses =
  async (token) => {

    if (!token) {
      throw new Error(
        "Authentication token is missing. Please login again."
      );
    }


    const response =
      await fetch(
        `${API_BASE_URL}/analyses`,
        {
          method: "GET",

          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );


    let data = null;

    try {
      data =
        await response.json();
    } catch {
      data = null;
    }


    if (
      response.status === 401
    ) {
      throw new Error(
        "Authentication expired. Please login again."
      );
    }


    if (!response.ok) {

      throw new Error(
        data?.message ||
        "Unable to fetch analyses."
      );
    }


    return data;
  };


/* =========================
   GET SINGLE ANALYSIS
========================= */

export const getAnalysis =
  async (
    analysisId,
    token
  ) => {

    if (!analysisId) {
      throw new Error(
        "Analysis ID is required."
      );
    }


    if (!token) {
      throw new Error(
        "Authentication token is missing. Please login again."
      );
    }


    const response =
      await fetch(
        `${API_BASE_URL}/analyses/${analysisId}`,
        {
          method: "GET",

          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );


    let data = null;

    try {
      data =
        await response.json();
    } catch {
      data = null;
    }


    if (
      response.status === 401
    ) {
      throw new Error(
        "Authentication expired. Please login again."
      );
    }


    if (!response.ok) {

      throw new Error(
        data?.message ||
        "Unable to fetch analysis."
      );
    }


    return data;
  };