import os
import requests


PRODUCT_ID = "199e730c-3b5c-4a2a-81d6-409622b4508e"

TOKEN_FILE = "cdse_token.txt"

OUTPUT_FILE = (
    "S2A_MSIL2A_20170613T101031_"
    "N0500_R022_T33UUP_20231008T194656.zip"
)


with open(
    TOKEN_FILE,
    "r",
    encoding="utf-8"
) as f:
    token = f.read().strip()


if not token:
    raise RuntimeError(
        "CDSE token is empty."
    )


url = (
    "https://zipper.dataspace.copernicus.eu"
    "/odata/v1/Products("
    + PRODUCT_ID
    + ")/$value"
)


headers = {
    "Authorization": "Bearer " + token
}


print("Starting Sentinel-2 product download...")
print()
print("Product ID:", PRODUCT_ID)
print()
print("URL:")
print(url)
print()


response = requests.get(
    url,
    headers=headers,
    stream=True,
    timeout=300
)


print(
    "HTTP Status:",
    response.status_code
)


if response.status_code != 200:
    print(response.text)
    response.raise_for_status()


total = int(
    response.headers.get(
        "Content-Length",
        "0"
    )
)

downloaded = 0


with open(
    OUTPUT_FILE,
    "wb"
) as f:

    for chunk in response.iter_content(
        chunk_size=1024 * 1024
    ):

        if not chunk:
            continue

        f.write(chunk)

        downloaded += len(chunk)

        if total:

            percent = (
                downloaded / total
            ) * 100

            downloaded_gb = (
                downloaded /
                (1024 ** 3)
            )

            total_gb = (
                total /
                (1024 ** 3)
            )

            print(
                f"\r{percent:.1f}% "
                f"({downloaded_gb:.2f} / "
                f"{total_gb:.2f} GB)",
                end=""
            )


print()
print()

print("================================")
print("DOWNLOAD COMPLETE")
print("================================")

print(
    "Saved:",
    OUTPUT_FILE
)

print(
    "Size:",
    round(
        os.path.getsize(
            OUTPUT_FILE
        ) / (1024 ** 3),
        2
    ),
    "GB"
)