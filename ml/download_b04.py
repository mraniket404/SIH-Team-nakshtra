import os
import requests


TOKEN_FILE = "cdse_token.txt"

OUTPUT_DIR = "test_data"

OUTPUT_FILE = os.path.join(
    OUTPUT_DIR,
    "T33UUP_20170613T101031_B04_10m.jp2"
)


NODE_URI = (
    "https://download.dataspace.copernicus.eu"
    "/odata/v1/Products(199e730c-3b5c-4a2a-81d6-409622b4508e)"
    "/Nodes(S2A_MSIL2A_20170613T101031_N0500_R022_T33UUP_20231008T194656.SAFE)"
    "/Nodes(GRANULE)"
    "/Nodes(L2A_T33UUP_A010315_20170613T101608)"
    "/Nodes(IMG_DATA)"
    "/Nodes(R10m)"
    "/Nodes(T33UUP_20170613T101031_B04_10m.jp2)"
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


headers = {
    "Authorization": "Bearer " + token
}


os.makedirs(
    OUTPUT_DIR,
    exist_ok=True
)


print("Downloading B04...")
print()
print("File:")
print(
    "T33UUP_20170613T101031_B04_10m.jp2"
)
print()


response = requests.get(
    NODE_URI,
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

            print(
                f"\rDownloaded: {percent:.1f}%",
                end=""
            )


print()
print()

print(
    "================================"
)

print(
    "DOWNLOAD SUCCESS"
)

print(
    "================================"
)

print(
    "Saved:",
    OUTPUT_FILE
)

print(
    "Size:",
    round(
        os.path.getsize(OUTPUT_FILE)
        / (1024 * 1024),
        2
    ),
    "MB"
)