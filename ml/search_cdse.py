import requests


BASE_URL = (
    "https://catalogue.dataspace.copernicus.eu"
    "/odata/v1/Products"
)


params = {
    "$filter": (
        "Collection/Name eq 'SENTINEL-2' "
        "and startswith(Name,'S2A_MSIL2A_20170613T101031') "
        "and contains(Name,'T33UUP')"
    ),
    "$top": 10,
}


print("Searching exact Sentinel-2 scene...")
print("Tile: T33UUP")
print("Date: 2017-06-13")
print()


response = requests.get(
    BASE_URL,
    params=params,
    timeout=60,
)


print("HTTP Status:", response.status_code)

response.raise_for_status()

data = response.json()

products = data.get("value", [])


print(
    "Exact T33UUP products found:",
    len(products),
)

print()


for product in products:

    print("=" * 90)

    print("PRODUCT ID:")
    print(product.get("Id"))

    print()

    print("PRODUCT NAME:")
    print(product.get("Name"))

    print()

    print("SIZE:")
    size = product.get("ContentLength")

    if size:
        print(
            f"{size / (1024 ** 3):.2f} GB"
        )
    else:
        print("Unknown")

    print()

    print("ONLINE:")
    print(product.get("Online"))

    print()

    print("S3 PATH:")
    print(product.get("S3Path"))

    print()