import os
import requests
import rasterio
from dotenv import load_dotenv


load_dotenv()


PRODUCT_ID = "199e730c-3b5c-4a2a-81d6-409622b4508e"

SAFE_NAME = (
    "S2A_MSIL2A_20170613T101031_N0500_R022_"
    "T33UUP_20231008T194656.SAFE"
)

GRANULE_NAME = (
    "L2A_T33UUP_A010315_20170613T101608"
)

BAND_NAME = (
    "T33UUP_20170613T101031_B04_10m.jp2"
)


TOKEN_FILE = "cdse_token.txt"

OUTPUT_DIR = "test_data"

JP2_PATH = os.path.join(
    OUTPUT_DIR,
    BAND_NAME
)

TIF_PATH = os.path.join(
    OUTPUT_DIR,
    "T33UUP_20170613_B04.tif"
)


BASE_URL = (
    "https://download.dataspace.copernicus.eu"
    f"/odata/v1/Products({PRODUCT_ID})"
    f"/Nodes({SAFE_NAME})"
    "/Nodes(GRANULE)"
    f"/Nodes({GRANULE_NAME})"
    "/Nodes(IMG_DATA)"
    "/Nodes(R10m)"
    f"/Nodes({BAND_NAME})"
)


# ---------------------------------
# Read token
# ---------------------------------

if not os.path.exists(TOKEN_FILE):
    raise FileNotFoundError(
        "cdse_token.txt not found."
    )


with open(
    TOKEN_FILE,
    "r",
    encoding="utf-8"
) as file:

    token = file.read().strip()


if not token:
    raise RuntimeError(
        "CDSE token file is empty."
    )


# ---------------------------------
# Prepare output folder
# ---------------------------------

os.makedirs(
    OUTPUT_DIR,
    exist_ok=True
)


# ---------------------------------
# Download JP2
# ---------------------------------

print()
print(
    "Downloading real Sentinel-2 B04..."
)

print()
print(
    "Source:"
)

print(BASE_URL)

print()


headers = {
    "Authorization": f"Bearer {token}"
}


response = requests.get(
    BASE_URL,
    headers=headers,
    stream=True,
    timeout=120
)


print(
    "HTTP Status:",
    response.status_code
)


if response.status_code != 200:
    print(
        response.text
    )

    response.raise_for_status()


total = int(
    response.headers.get(
        "Content-Length",
        0
    )
)


downloaded = 0


with open(
    JP2_PATH,
    "wb"
) as file:

    for chunk in response.iter_content(
        chunk_size=1024 * 1024
    ):

        if not chunk:
            continue

        file.write(chunk)

        downloaded += len(chunk)

        if total:

            percent = (
                downloaded /
                total
            ) * 100

            print(
                f"\rDownloaded: {percent:.1f}%",
                end=""
            )


print()
print()

print(
    "JP2 downloaded:"
)

print(
    JP2_PATH
)


# ---------------------------------
# Convert JP2 → GeoTIFF
# ---------------------------------

print()
print(
    "Converting JP2 → GeoTIFF..."
)


with rasterio.open(
    JP2_PATH
) as src:

    print(
        "Width:",
        src.width
    )

    print(
        "Height:",
        src.height
    )

    print(
        "CRS:",
        src.crs
    )

    print(
        "Bands:",
        src.count
    )

    print(
        "Data type:",
        src.dtypes[0]
    )


    profile = src.profile.copy()

    profile.update(
        driver="GTiff",
        compress="deflate",
        tiled=True
    )


    with rasterio.open(
        TIF_PATH,
        "w",
        **profile
    ) as dst:

        for band_index in range(
            1,
            src.count + 1
        ):

            dst.write(
                src.read(
                    band_index
                ),
                band_index
            )


# ---------------------------------
# Verify GeoTIFF
# ---------------------------------

print()

print(
    "GeoTIFF created:"
)

print(
    TIF_PATH
)


print()
print(
    "Final raster information:"
)


with rasterio.open(
    TIF_PATH
) as src:

    print(
        "Width:",
        src.width
    )

    print(
        "Height:",
        src.height
    )

    print(
        "Bands:",
        src.count
    )

    print(
        "CRS:",
        src.crs
    )

    print(
        "Bounds:",
        src.bounds
    )

    print(
        "Transform:",
        src.transform
    )

    print(
        "Dtype:",
        src.dtypes[0]
    )

    print(
        "Resolution:",
        src.res
    )


print()
print(
    "================================"
)

print(
    "SUCCESS"
)

print(
    "Real Sentinel-2 B04 GeoTIFF ready."
)

print(
    "================================"
)