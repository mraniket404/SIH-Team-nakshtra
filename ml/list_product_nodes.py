import requests

PRODUCT_ID = "199e730c-3b5c-4a2a-81d6-409622b4508e"

URL = (
    "https://download.dataspace.copernicus.eu"
    f"/odata/v1/Products({PRODUCT_ID})/Nodes"
)

print("Listing product nodes...")
print(URL)
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
    print("NAME:", node.get("Name"))
    print("SIZE:", node.get("ContentLength"))
    print("CHILDREN:", node.get("ChildrenNumber"))

    if node.get("Nodes"):
        print("CHILD URI:")
        print(node["Nodes"].get("uri"))

    print()