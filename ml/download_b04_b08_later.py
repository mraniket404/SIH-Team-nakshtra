import os
import requests
import rasterio


# ============================================================
# CONFIG
# ============================================================

TOKEN_FILE = "cdse_token.txt"

OUTPUT_DIR = os.path.join(
    "test_data",
    "bi_temporal",
    "later_2024",
)


# ============================================================
# EXACT NODE DOWNLOAD URLS
# ============================================================

BAND_URLS = {

    "B04": (
        "https://download.dataspace.copernicus.eu"
        "/odata/v1/Products"
        "(1e4cda7a-d93b-4acd-9269-173f7c4f96ce)"
        "/Nodes"
        "(S2A_MSIL2A_20240626T101031_N0510_R022_T33UUP_20240626T174950.SAFE)"
        "/Nodes(GRANULE)"
        "/Nodes(L2A_T33UUP_A047066_20240626T101124)"
        "/Nodes(IMG_DATA)"
        "/Nodes(R10m)"
        "/Nodes(T33UUP_20240626T101031_B04_10m.jp2)"
        "/$value"
    ),

    "B08": (
        "https://download.dataspace.copernicus.eu"
        "/odata/v1/Products"
        "(1e4cda7a-d93b-4acd-9269-173f7c4f96ce)"
        "/Nodes"
        "(S2A_MSIL2A_20240626T101031_N0510_R022_T33UUP_20240626T174950.SAFE)"
        "/Nodes(GRANULE)"
        "/Nodes(L2A_T33UUP_A047066_20240626T101124)"
        "/Nodes(IMG_DATA)"
        "/Nodes(R10m)"
        "/Nodes(T33UUP_20240626T101031_B08_10m.jp2)"
        "/$value"
    ),
}


# ============================================================
# TOKEN
# ============================================================

if not os.path.exists(TOKEN_FILE):

    raise FileNotFoundError(
        "cdse_token.txt not found."
    )


with open(
    TOKEN_FILE,
    "r",
    encoding="utf-8",
) as file:

    token = file.read().strip()


if not token:

    raise RuntimeError(
        "CDSE token is empty."
    )


headers = {
    "Authorization": f"Bearer {token}"
}


# ============================================================
# OUTPUT DIRECTORY
# ============================================================

os.makedirs(
    OUTPUT_DIR,
    exist_ok=True,
)


# ============================================================
# DOWNLOAD + CONVERT
# ============================================================

def download_band(
    band,
    url,
):

    print()
    print("=" * 80)
    print(f"PROCESSING {band}")
    print("=" * 80)

    jp2_name = (
        f"T33UUP_20240626_{band}_10m.jp2"
    )

    tif_name = (
        f"T33UUP_20240626_{band}.tif"
    )

    jp2_path = os.path.join(
        OUTPUT_DIR,
        jp2_name,
    )

    tif_path = os.path.join(
        OUTPUT_DIR,
        tif_name,
    )


    # ========================================================
    # DOWNLOAD
    # ========================================================

    print()
    print("Downloading:")
    print(url)
    print()

    response = requests.get(
        url,
        headers=headers,
        stream=True,
        timeout=300,
    )

    print(
        "HTTP Status:",
        response.status_code,
    )


    if response.status_code != 200:

        print()
        print(
            "SERVER RESPONSE:"
        )

        print(
            response.text
        )

        response.raise_for_status()


    total = int(
        response.headers.get(
            "Content-Length",
            0,
        )
    )

    downloaded = 0


    with open(
        jp2_path,
        "wb",
    ) as file:

        for chunk in response.iter_content(
            chunk_size=1024 * 1024,
        ):

            if not chunk:
                continue

            file.write(chunk)

            downloaded += len(chunk)

            if total:

                percent = (
                    downloaded
                    / total
                    * 100
                )

                print(
                    f"\rDownloaded: "
                    f"{percent:.1f}%",
                    end="",
                )


    print()
    print()

    print(
        "JP2 saved:"
    )

    print(
        jp2_path
    )


    # ========================================================
    # CONVERT JP2 → GEOTIFF
    # ========================================================

    print()
    print(
        "Converting JP2 → GeoTIFF..."
    )


    with rasterio.open(
        jp2_path
    ) as src:

        print(
            "Width:",
            src.width,
        )

        print(
            "Height:",
            src.height,
        )

        print(
            "Bands:",
            src.count,
        )

        print(
            "CRS:",
            src.crs,
        )

        print(
            "Resolution:",
            src.res,
        )

        print(
            "Dtype:",
            src.dtypes[0],
        )


        profile = src.profile.copy()

        profile.update(
            driver="GTiff",
            compress="deflate",
            tiled=True,
        )


        with rasterio.open(
            tif_path,
            "w",
            **profile,
        ) as dst:

            for index in range(
                1,
                src.count + 1,
            ):

                dst.write(
                    src.read(index),
                    index,
                )


    # ========================================================
    # VERIFY
    # ========================================================

    print()
    print(
        "GeoTIFF created:"
    )

    print(
        tif_path
    )


    with rasterio.open(
        tif_path
    ) as src:

        print()
        print(
            "FINAL RASTER:"
        )

        print(
            "Width:",
            src.width,
        )

        print(
            "Height:",
            src.height,
        )

        print(
            "Bands:",
            src.count,
        )

        print(
            "CRS:",
            src.crs,
        )

        print(
            "Resolution:",
            src.res,
        )

        print(
            "Bounds:",
            src.bounds,
        )

        print(
            "Dtype:",
            src.dtypes[0],
        )


    print()
    print(
        f"{band} SUCCESS"
    )

    return tif_path


# ============================================================
# B04
# ============================================================

b04_path = download_band(
    "B04",
    BAND_URLS["B04"],
)


# ============================================================
# B08
# ============================================================

b08_path = download_band(
    "B08",
    BAND_URLS["B08"],
)


# ============================================================
# FINAL
# ============================================================

print()
print("=" * 80)
print("2024 DATASET READY")
print("=" * 80)

print()

print(
    "B04 / RED:"
)

print(
    b04_path
)

print()

print(
    "B08 / NIR:"
)

print(
    b08_path
)

print()

print(
    "Output directory:"
)

print(
    OUTPUT_DIR
)