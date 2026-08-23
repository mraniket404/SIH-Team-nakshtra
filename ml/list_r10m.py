import requests


PRODUCT_ID = "199e730c-3b5c-4a2a-81d6-409622b4508e"

SAFE_NAME = (
    "S2A_MSIL2A_20170613T101031_N0500_R022_"
    "T33UUP_20231008T194656.SAFE"
)

GRANULE_NAME = (
    "L2A_T33UUP_A010315_20170613T101608"
)


URL = (
    "https://download.dataspace.copernicus.eu"
    f"/odata/v1/Products({PRODUCT_ID})"
    f"/Nodes({SAFE_NAME})"
    "/Nodes(GRANULE)"
    f"/Nodes({GRANULE_NAME})"
    "/Nodes(IMG_DATA)"
    "/Nodes(R10m)"
    "/Nodes"
)


print("Listing R10m bands...")
print()

response = requests.get(
    URL,
    timeout=60,
)

print(
    "HTTP Status:",
    response.status_code
)

response.raise_for_status()

data = response.json()

nodes = data.get("result", [])

print(
    "Files found:",
    len(nodes)
)

print()

for node in nodes:

    print("=" * 80)

    print("NAME:")
    print(node.get("Name"))

    size = node.get("ContentLength")

    if size:
        print(
            "SIZE:",
            f"{size / (1024 ** 2):.2f} MB"
        )
    else:
        print("SIZE: 0")

    print()