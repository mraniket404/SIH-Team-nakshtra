from pathlib import Path

from fastapi import FastAPI, HTTPException

from services.raster_service import (
    inspect_raster,
    calculate_ndvi,
)


app = FastAPI(
    title="SatQuery AI ML Service",
    version="1.0.0",
)


@app.get("/health")
def health():
    return {
        "success": True,
        "service": "satquery-ml",
        "status": "healthy",
    }


@app.post("/raster/inspect")
def raster_inspect(file_path: str):

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


@app.post("/raster/ndvi")
def raster_ndvi(
    red_file_path: str,
    nir_file_path: str,
):

    try:

        red_path = Path(
            red_file_path
        )

        # ============================================
        # OUTPUT DIRECTORY
        # ============================================

        output_directory = (
            red_path.parent
            / "ndvi"
        )

        output_directory.mkdir(
            parents=True,
            exist_ok=True,
        )

        # ============================================
        # NDVI RASTER OUTPUT
        # ============================================

        output_path = (
            output_directory
            / "ndvi_result.tif"
        )

        # ============================================
        # NDVI PREVIEW OUTPUT
        # ============================================

        preview_path = (
            output_directory
            / "ndvi_preview.png"
        )

        # ============================================
        # CALCULATE NDVI
        # ============================================

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

        return {
            "success": True,

            "analysis": result,

            "visualization": {
                "preview_file": str(
                    preview_path
                ),

                "preview_width": result.get(
                    "preview_dimensions",
                    {}
                ).get(
                    "width"
                ),

                "preview_height": result.get(
                    "preview_dimensions",
                    {}
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

    except Exception as error:

        raise HTTPException(
            status_code=500,
            detail=(
                "NDVI processing failed: "
                f"{error}"
            ),
        )