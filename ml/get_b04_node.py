import requests

PRODUCT_ID = "199e730c-3b5c-4a2a-81d6-409622b4508e"

SAFE_NAME = "S2A_MSIL2A_20170613T101031_N0500_R022_T33UUP_20231008T194656.SAFE"

GRANULE_NAME = "L2A_T33UUP_A010315_20170613T101608"

URL = (
    "https://download.dataspace.copernicus.eu"
    "/odata/v1/Products("
    + PRODUCT_ID
    + ")/Nodes("
    + SAFE_NAME
    + ")/Nodes(GRANULE)"
    + "/Nodes("
    + GRANULE_NAME
    + ")/Nodes(IMG_DATA)"
    + "/Nodes(R10m)/Nodes"
)

with open("cdse_token.txt", "r", encoding="utf-8") as f:
    token = f.read().strip()

response = requests.get(
    URL,
    headers={
        "Authorization": "Bearer " + token
    },
    timeout=60
)

print("Status:", response.status_code)

response.raise_for_status()

data = response.json()

for node in data.get("result", []):

    if "B04" in node.get("Name", ""):

        print()
        print("B04 NODE:")
        print(node)
        print()

        print("ALL KEYS:")
        print(node.keys())