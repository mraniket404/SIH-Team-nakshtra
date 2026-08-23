import os

import rasterio


SOURCE_DIR = r".\sentinel_product"
OUTPUT_DIR = r".\test_data"


os.makedirs(
    OUTPUT_DIR,
    exist_ok=True
)


bands = [
    "B02",
    "B03",
    "B04",
    "B08",
]


# Find SAFE directory
safe_dir = None

for root, dirs, files in os.walk(SOURCE_DIR):

    for directory in dirs:

        if directory.endswith(".SAFE"):

            safe_dir = os.path.join(
                root,
                directory
            )

            break

    if safe_dir:
        break


if not safe_dir:

    raise FileNotFoundError(
        "SAFE directory not found."
    )


print("SAFE directory:")
print(safe_dir)
print()


for band in bands:

    source_file = None

    for root, dirs, files in os.walk(
        safe_dir
    ):

        for file in files:

            if file.endswith(
                f"_{band}_10m.jp2"
            ):

                source_file = os.path.join(
                    root,
                    file
                )

                break

        if source_file:
            break


    if not source_file:

        print(
            f"{band}: NOT FOUND"
        )

        continue


    output_file = os.path.join(
        OUTPUT_DIR,
        f"T33UUP_20170613T101031_{band}.tif"
    )


    print(
        f"Converting {band}..."
    )

    print(
        "Source:",
        source_file
    )


    with rasterio.open(
        source_file
    ) as src:

        profile = src.profile.copy()

        profile.update(
            driver="GTiff",
            compress="deflate",
            tiled=True
        )


        with rasterio.open(
            output_file,
            "w",
            **profile
        ) as dst:

            dst.write(
                src.read()
            )


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
            "Dtype:",
            src.dtypes[0]
        )


    print(
        "Created:",
        output_file
    )

    print()


print("================================")
print("CONVERSION COMPLETE")
print("================================")