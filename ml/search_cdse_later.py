import requests


BASE_URL = (
    "https://catalogue.dataspace.copernicus.eu"
    "/odata/v1/Products"
)


params = {
    "$filter": (
        "Collection/Name eq 'SENTINEL-2' "
        "and Name ge 'S2A_MSIL2A_20240601T000000' "
        "and Name lt 'S2A_MSIL2A_20240801T000000' "
        "and contains(Name,'T33UUP')"
    ),

    "$top": 50,
}


print("Searching later Sentinel-2 scenes...")
print("Tile: T33UUP")
print("Period: June-July 2024")
print()


response = requests.get(
    BASE_URL,
    params=params,
    timeout=60,
)


print(
    "HTTP Status:",
    response.status_code,
)

response.raise_for_status()


data = response.json()

products = data.get(
    "value",
    [],
)


print(
    "Products found:",
    len(products),
)

print()


for index, product in enumerate(
    products,
    start=1,
):

    print("=" * 90)

    print(
        f"RESULT #{index}"
    )

    print()

    print(
        "PRODUCT ID:"
    )

    print(
        product.get("Id")
    )

    print()

    print(
        "PRODUCT NAME:"
    )

    print(
        product.get("Name")
    )

    print()

    print(
        "SIZE:"
    )

    size = product.get(
        "ContentLength"
    )

    if size:

        print(
            f"{size / (1024 ** 3):.2f} GB"
        )

    else:

        print(
            "Unknown"
        )

    print()

    print(
        "ONLINE:"
    )

    print(
        product.get("Online")
    )

    print()

    print(
        "S3 PATH:"
    )

    print(
        product.get("S3Path")
    )

    print()