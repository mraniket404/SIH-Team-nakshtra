from pathlib import Path

import numpy as np
import rasterio
from rasterio.enums import Resampling
from PIL import Image


SUPPORTED_EXTENSIONS = {
    ".tif",
    ".tiff",
}


def inspect_raster(file_path: str) -> dict:
    path = Path(file_path)

    if not path.exists():
        raise FileNotFoundError(
            f"Raster file not found: {file_path}"
        )

    if path.suffix.lower() not in SUPPORTED_EXTENSIONS:
        raise ValueError(
            "Only GeoTIFF files are supported."
        )

    with rasterio.open(path) as src:
        bounds = src.bounds

        return {
            "filename": path.name,
            "format": "GeoTIFF",
            "width": src.width,
            "height": src.height,
            "band_count": src.count,
            "dtype": src.dtypes[0],
            "crs": (
                src.crs.to_string()
                if src.crs
                else None
            ),
            "resolution": {
                "x": src.res[0],
                "y": src.res[1],
            },
            "bounds": {
                "left": bounds.left,
                "bottom": bounds.bottom,
                "right": bounds.right,
                "top": bounds.top,
            },
            "transform": list(src.transform),
            "nodata": src.nodata,
        }


def generate_ndvi_preview(
    ndvi_file_path: str,
    preview_file_path: str,
    max_size: int = 1200,
) -> dict:

    ndvi_path = Path(ndvi_file_path)
    preview_path = Path(preview_file_path)

    if not ndvi_path.exists():
        raise FileNotFoundError(
            f"NDVI raster not found: {ndvi_file_path}"
        )

    preview_path.parent.mkdir(
        parents=True,
        exist_ok=True,
    )

    with rasterio.open(ndvi_path) as src:

        scale = min(
            1.0,
            max_size / max(
                src.width,
                src.height,
            ),
        )

        preview_width = max(
            1,
            int(src.width * scale),
        )

        preview_height = max(
            1,
            int(src.height * scale),
        )

        ndvi = src.read(
            1,
            out_shape=(
                preview_height,
                preview_width,
            ),
            resampling=Resampling.bilinear,
        ).astype(np.float32)

        nodata = src.nodata

    valid_mask = np.isfinite(ndvi)

    if nodata is not None:
        valid_mask &= ndvi != nodata

    # NDVI range used for visualization.
    # Values below -1 or above +1 are clipped.
    clipped = np.clip(
        ndvi,
        -1.0,
        1.0,
    )

    # Normalize NDVI from [-1, 1] to [0, 255]
    normalized = (
        (clipped + 1.0)
        / 2.0
        * 255.0
    )

    normalized = np.nan_to_num(
        normalized,
        nan=0.0,
    )

    grayscale = normalized.astype(
        np.uint8
    )

    # Create RGB image.
    rgb = np.stack(
        [
            grayscale,
            grayscale,
            grayscale,
        ],
        axis=-1,
    )

    # Invalid pixels become transparent/black.
    rgb[~valid_mask] = 0

    image = Image.fromarray(
        rgb,
        mode="RGB",
    )

    image.save(
        preview_path,
        format="PNG",
        optimize=True,
    )

    return {
        "preview_file": str(
            preview_path
        ),
        "width": preview_width,
        "height": preview_height,
    }


def calculate_ndvi(
    red_file_path: str,
    nir_file_path: str,
    output_file_path: str,
    preview_file_path: str | None = None,
) -> dict:

    red_path = Path(red_file_path)
    nir_path = Path(nir_file_path)
    output_path = Path(output_file_path)

    if not red_path.exists():
        raise FileNotFoundError(
            f"Red band file not found: {red_file_path}"
        )

    if not nir_path.exists():
        raise FileNotFoundError(
            f"NIR band file not found: {nir_file_path}"
        )

    if red_path.suffix.lower() not in SUPPORTED_EXTENSIONS:
        raise ValueError(
            "Red band must be a GeoTIFF file."
        )

    if nir_path.suffix.lower() not in SUPPORTED_EXTENSIONS:
        raise ValueError(
            "NIR band must be a GeoTIFF file."
        )

    output_path.parent.mkdir(
        parents=True,
        exist_ok=True,
    )

    with rasterio.open(red_path) as red_src:

        red = red_src.read(1).astype(
            np.float32
        )

        red_profile = red_src.profile.copy()

        red_nodata = red_src.nodata

        red_transform = red_src.transform
        red_crs = red_src.crs

        red_width = red_src.width
        red_height = red_src.height

    with rasterio.open(nir_path) as nir_src:

        nir = nir_src.read(1).astype(
            np.float32
        )

        if (
            nir_src.width != red_width
            or nir_src.height != red_height
        ):
            raise ValueError(
                "Red and NIR rasters must have "
                "the same dimensions."
            )

        if nir_src.transform != red_transform:
            raise ValueError(
                "Red and NIR rasters must have "
                "the same spatial transform."
            )

        if nir_src.crs != red_crs:
            raise ValueError(
                "Red and NIR rasters must have "
                "the same CRS."
            )

        nir_nodata = nir_src.nodata

    denominator = nir + red

    valid_mask = (
        np.isfinite(nir)
        & np.isfinite(red)
        & (denominator != 0)
    )

    if red_nodata is not None:
        valid_mask &= red != red_nodata

    if nir_nodata is not None:
        valid_mask &= nir != nir_nodata

    ndvi = np.full(
        red.shape,
        np.nan,
        dtype=np.float32,
    )

    ndvi[valid_mask] = (
        (nir[valid_mask] - red[valid_mask])
        / denominator[valid_mask]
    )

    valid_values = ndvi[
        np.isfinite(ndvi)
    ]

    if valid_values.size == 0:
        raise ValueError(
            "No valid pixels available "
            "for NDVI calculation."
        )

    ndvi_min = float(
        np.min(valid_values)
    )

    ndvi_max = float(
        np.max(valid_values)
    )

    ndvi_mean = float(
        np.mean(valid_values)
    )

    ndvi_median = float(
        np.median(valid_values)
    )

    low_mask = valid_values < 0.2

    moderate_mask = (
        (valid_values >= 0.2)
        & (valid_values < 0.5)
    )

    healthy_mask = valid_values >= 0.5

    total_valid = valid_values.size

    low_percentage = (
        float(np.sum(low_mask))
        / total_valid
        * 100
    )

    moderate_percentage = (
        float(np.sum(moderate_mask))
        / total_valid
        * 100
    )

    healthy_percentage = (
        float(np.sum(healthy_mask))
        / total_valid
        * 100
    )

    red_profile.update(
        driver="GTiff",
        dtype="float32",
        count=1,
        nodata=-9999.0,
        compress="deflate",
        tiled=True,
    )

    output_array = np.where(
        np.isfinite(ndvi),
        ndvi,
        -9999.0,
    ).astype(np.float32)

    with rasterio.open(
        output_path,
        "w",
        **red_profile,
    ) as dst:

        dst.write(
            output_array,
            1,
        )

    # ============================================
    # NDVI VISUALIZATION PREVIEW
    # ============================================

    preview_result = None

    if preview_file_path:

        preview_result = (
            generate_ndvi_preview(
                output_path,
                preview_file_path,
            )
        )

    return {
        "type": "NDVI",

        "red_band": red_path.name,

        "nir_band": nir_path.name,

        "output_file": str(
            output_path
        ),

        "preview_file": (
            preview_result["preview_file"]
            if preview_result
            else None
        ),

        "preview_dimensions": (
            {
                "width": preview_result["width"],
                "height": preview_result["height"],
            }
            if preview_result
            else None
        ),

        "dimensions": {
            "width": red_width,
            "height": red_height,
        },

        "crs": (
            red_crs.to_string()
            if red_crs
            else None
        ),

        "statistics": {
            "min": ndvi_min,
            "max": ndvi_max,
            "mean": ndvi_mean,
            "median": ndvi_median,
        },

        "vegetation": {
            "low_percentage": round(
                low_percentage,
                2,
            ),
            "moderate_percentage": round(
                moderate_percentage,
                2,
            ),
            "healthy_percentage": round(
                healthy_percentage,
                2,
            ),
        },

        "valid_pixel_count": int(
            total_valid
        ),
    }