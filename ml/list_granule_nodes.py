import requests

URL = (
    "https://download.dataspace.copernicus.eu"
    "/odata/v1/Products"
    "(199e730c-3b5c-4a2a-81d6-409622b4508e)"
    "/Nodes("
    "S2A_MSIL2A_20170613T101031_N0500_R022_T33UUP_20231008T194656.SAFE"
    ")/Nodes"
)

print("Listing SAFE contents...")
print()

response = requests.get(
    URL,
    timeout=60,
)

print("HTTP Status:", response.status_code)

response.raise_for_status()

data = response.json()

for node in data.get("result", []):

    print("=" * 80)

    print("NAME:")
    print(node.get("Name"))

    print()

    print("SIZE:")
    size = node.get("ContentLength")

    if size:
        print(
            f"{size / (1024 ** 2):.2f} MB"
        )
    else:
        print("0 / folder")

    print()

    print("CHILDREN:")
    print(node.get("ChildrenNumber"))

    print()

    if node.get("Nodes"):
        print("CHILD URI:")
        print(node["Nodes"].get("uri"))

    print()