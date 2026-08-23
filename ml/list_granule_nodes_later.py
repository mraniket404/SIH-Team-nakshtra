import requests


PRODUCT_ID = (
    "1e4cda7a-d93b-4acd-9269-173f7c4f96ce"
)

SAFE_NAME = (
    "S2A_MSIL2A_20240626T101031_N0510_R022_"
    "T33UUP_20240626T174950.SAFE"
)


URL = (
    "https://download.dataspace.copernicus.eu"
    "/odata/v1/Products"
    f"({PRODUCT_ID})"
    f"/Nodes({SAFE_NAME})"
    "/Nodes"
)


print("Listing 2024 SAFE contents...")
print()

print("Product:")
print(PRODUCT_ID)

print()

print("SAFE:")
print(SAFE_NAME)

print()


response = requests.get(
    URL,
    timeout=60,
)


print(
    "HTTP Status:",
    response.status_code,
)

response.raise_for_status()


data = response.json()


nodes = data.get(
    "result",
    [],
)


print(
    "Nodes found:",
    len(nodes),
)

print()


for node in nodes:

    print("=" * 80)

    print("NAME:")

    print(
        node.get("Name")
    )

    print()

    print("SIZE:")

    size = node.get(
        "ContentLength"
    )

    if size:

        print(
            f"{size / (1024 ** 2):.2f} MB"
        )

    else:

        print(
            "0 / folder"
        )

    print()

    print("CHILDREN:")

    print(
        node.get(
            "ChildrenNumber"
        )
    )

    print()

    if node.get("Nodes"):

        print("CHILD URI:")

        print(
            node["Nodes"].get(
                "uri"
            )
        )

    print()