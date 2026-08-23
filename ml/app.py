from pathlib import Path

from fastapi import FastAPI, HTTPException

from services.raster_service import (
    inspect_raster,
    calculate_ndvi,
    calculate_bitemporal_change,
)


app = FastAPI(
    title="SatQuery AI ML Service",
    version="1.0.0",
)


# ============================================================
# CONFIG
# ============================================================

ML_ROOT = Path(__file__).resolve().parent

OUTPUT_ROOT = (
    ML_ROOT / "outputs"
)


# ============================================================
# HEALTH
# ============================================================

@app.get("/health")
def health():

    return {
        "success": True,
        "service": "satquery-ml",
        "status": "healthy",
    }


# ============================================================
# RASTER INSPECTION
# ============================================================

@app.post("/raster/inspect")
def raster_inspect(
    file_path: str,
):

    try:

        metadata = inspect_raster(
            file_path
        )

        return {
            "success": True,
            "metadata": metadata,
        }

    except FileNotFoundError as error:

        raise HTTPException(
            status_code=404,
            detail=str(error),
        )

    except ValueError as error:

        raise HTTPException(
            status_code=400,
            detail=str(error),
        )

    except Exception as error:

        raise HTTPException(
            status_code=500,
            detail=(
                "Raster processing failed: "
                f"{error}"
            ),
        )


# ============================================================
# NDVI
# ============================================================

@app.post("/raster/ndvi")
def raster_ndvi(
    red_file_path: str,
    nir_file_path: str,
    analysis_id: str,
):

    try:

        if not analysis_id:

            raise HTTPException(
                status_code=400,
                detail="analysis_id is required.",
            )

        # ----------------------------------------------------
        # Unique NDVI output directory
        # ----------------------------------------------------

        output_directory = (
            OUTPUT_ROOT
            / "ndvi"
            / analysis_id
        )

        output_directory.mkdir(
            parents=True,
            exist_ok=True,
        )

        # ----------------------------------------------------
        # Output files
        # ----------------------------------------------------

        output_path = (
            output_directory
            / "ndvi_result.tif"
        )

        preview_path = (
            output_directory
            / "ndvi_preview.png"
        )

        # ----------------------------------------------------
        # Calculate NDVI
        # ----------------------------------------------------

        result = calculate_ndvi(
            red_file_path=red_file_path,

            nir_file_path=nir_file_path,

            output_file_path=str(
                output_path
            ),

            preview_file_path=str(
                preview_path
            ),
        )

        # ----------------------------------------------------
        # URLs
        # Backend will expose /ml-outputs
        # ----------------------------------------------------

        result["output_url"] = (
            f"/ml-outputs/ndvi/"
            f"{analysis_id}/"
            f"ndvi_result.tif"
        )

        result["preview_url"] = (
            f"/ml-outputs/ndvi/"
            f"{analysis_id}/"
            f"ndvi_preview.png"
        )

        return {

            "success": True,

            "analysis": result,

            "visualization": {

                "preview_file": str(
                    preview_path
                ),

                "preview_url": (
                    result["preview_url"]
                ),

                "preview_width": result.get(
                    "preview_dimensions",
                    {},
                ).get(
                    "width"
                ),

                "preview_height": result.get(
                    "preview_dimensions",
                    {},
                ).get(
                    "height"
                ),
            },
        }

    except FileNotFoundError as error:

        raise HTTPException(
            status_code=404,
            detail=str(error),
        )

    except ValueError as error:

        raise HTTPException(
            status_code=400,
            detail=str(error),
        )

    except HTTPException:

        raise

    except Exception as error:

        raise HTTPException(
            status_code=500,
            detail=(
                "NDVI processing failed: "
                f"{error}"
            ),
        )


# ============================================================
# BI-TEMPORAL CHANGE DETECTION
# ============================================================

@app.post("/raster/change")
def raster_change(
    earlier_file_path: str,
    later_file_path: str,
    analysis_id: str,
    threshold: float = 0.10,
):

    try:

        # ----------------------------------------------------
        # Validate analysis ID
        # ----------------------------------------------------

        if not analysis_id:

            raise HTTPException(
                status_code=400,
                detail="analysis_id is required.",
            )

        # ----------------------------------------------------
        # Validate threshold
        # ----------------------------------------------------

        if threshold < 0:

            raise HTTPException(
                status_code=400,
                detail=(
                    "threshold must be "
                    "greater than or equal to 0."
                ),
            )

        # ----------------------------------------------------
        # Create unique output directory
        #
        # ml/
        #   outputs/
        #     change/
        #       <analysis_id>/
        #           change_result.tif
        #           change_preview.png
        # ----------------------------------------------------

        output_directory = (
            OUTPUT_ROOT
            / "change"
            / analysis_id
        )

        output_directory.mkdir(
            parents=True,
            exist_ok=True,
        )

        # ----------------------------------------------------
        # Change raster
        # ----------------------------------------------------

        output_path = (
            output_directory
            / "change_result.tif"
        )

        # ----------------------------------------------------
        # Change preview
        # ----------------------------------------------------

        preview_path = (
            output_directory
            / "change_preview.png"
        )

        # ----------------------------------------------------
        # Calculate bi-temporal change
        # ----------------------------------------------------

        result = calculate_bitemporal_change(

            earlier_file_path=(
                earlier_file_path
            ),

            later_file_path=(
                later_file_path
            ),

            output_file_path=str(
                output_path
            ),

            preview_file_path=str(
                preview_path
            ),

            threshold=threshold,
        )

        # ----------------------------------------------------
        # Browser-accessible URLs
        # ----------------------------------------------------

        result["output_url"] = (
            f"/ml-outputs/change/"
            f"{analysis_id}/"
            f"change_result.tif"
        )

        result["preview_url"] = (
            f"/ml-outputs/change/"
            f"{analysis_id}/"
            f"change_preview.png"
        )

        # ----------------------------------------------------
        # Response
        # ----------------------------------------------------

        return {

            "success": True,

            "analysis": result,

            "visualization": {

                "preview_file": str(
                    preview_path
                ),

                "preview_url": (
                    result["preview_url"]
                ),

                "preview_width": result.get(
                    "preview_dimensions",
                    {},
                ).get(
                    "width"
                ),

                "preview_height": result.get(
                    "preview_dimensions",
                    {},
                ).get(
                    "height"
                ),
            },
        }

    except FileNotFoundError as error:

        raise HTTPException(
            status_code=404,
            detail=str(error),
        )

    except ValueError as error:

        raise HTTPException(
            status_code=400,
            detail=str(error),
        )

    except HTTPException:

        raise

    except Exception as error:

        raise HTTPException(
            status_code=500,
            detail=(
                "Bi-temporal change processing "
                f"failed: {error}"
            ),
        )