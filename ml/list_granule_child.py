import requests


PRODUCT_ID = "199e730c-3b5c-4a2a-81d6-409622b4508e"

SAFE_NAME = (
    "S2A_MSIL2A_20170613T101031_N0500_R022_"
    "T33UUP_20231008T194656.SAFE"
)

URL = (
    "https://download.dataspace.copernicus.eu"
    f"/odata/v1/Products({PRODUCT_ID})"
    f"/Nodes({SAFE_NAME})"
    "/Nodes(GRANULE)/Nodes"
)


print("Listing GRANULE contents...")
print()
print("URL:")
print(URL)
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
    "Children found:",
    len(nodes)
)

print()

for node in nodes:

    print("=" * 80)

    print(
        "NAME:",
        node.get("Name")
    )

    print(
        "SIZE:",
        node.get("ContentLength")
    )

    print(
        "CHILDREN:",
        node.get("ChildrenNumber")
    )

    if node.get("Nodes"):
        print(
            "CHILD URI:",
            node["Nodes"].get("uri")
        )

    print()